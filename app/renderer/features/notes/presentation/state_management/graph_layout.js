"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGraphLayout = exports.workerLayout = void 0;
var hooks_1 = require("preact/hooks");
// One worker per run, ended when it answers, fails or is cancelled. A
// cancelled run's promise never settles, and nothing waits on it.
var workerLayout = function (input, onProgress) {
    var worker = new Worker(new URL('./note_graph.worker.ts', import.meta.url), { type: 'module' });
    var done = new Promise(function (resolve, reject) {
        worker.onmessage = function (event) {
            var message = event.data;
            if (message.kind === 'progress')
                return onProgress(message.share);
            worker.terminate();
            if (message.kind === 'done')
                resolve(message.points);
            else
                reject(new Error(message.detail));
        };
        worker.onerror = function (event) {
            worker.terminate();
            reject(new Error("the layout worker stopped: ".concat(event.message)));
        };
    });
    worker.postMessage(input);
    return { done: done, cancel: function () { return worker.terminate(); } };
};
exports.workerLayout = workerLayout;
var LAYING = { kind: 'laying', share: 0 };
// input must keep its identity until the graph changes (callers memoise it); null means nothing to lay out.
var useGraphLayout = function (run, input, log, ready) {
    if (ready === void 0) { ready = null; }
    // Each state remembers its input, so a new input reads as laying from its
    // first render instead of showing the old input's result until its run starts.
    var _a = (0, hooks_1.useState)({ input: input, state: ready === null ? LAYING : { kind: 'done', points: ready } }), held = _a[0], setHeld = _a[1];
    var state = input === null || held.input === input ? held.state : LAYING;
    var _b = (0, hooks_1.useState)(0), attempt = _b[0], setAttempt = _b[1];
    // Points ready for the first input stand in for its run; a later input or a retry runs.
    var skip = (0, hooks_1.useRef)(ready !== null ? input : undefined);
    var latestLog = (0, hooks_1.useRef)(log);
    latestLog.current = log;
    (0, hooks_1.useEffect)(function () {
        if (input === null)
            return;
        var isSkipped = skip.current === input;
        skip.current = undefined;
        if (isSkipped)
            return;
        // A run that was replaced or left may still answer; its answer is for a
        // graph no longer on screen, so it is dropped.
        var isCurrent = true;
        setHeld({ input: input, state: LAYING });
        var fail = function (error) {
            var _a;
            latestLog.current("graph layout failed: ".concat(error instanceof Error ? ((_a = error.stack) !== null && _a !== void 0 ? _a : error.message) : String(error)));
            setHeld({ input: input, state: { kind: 'failed' } });
        };
        var job;
        try {
            job = run(input, function (share) { return isCurrent && setHeld({ input: input, state: { kind: 'laying', share: share } }); });
        }
        catch (error) {
            fail(error);
            return function () {
                isCurrent = false;
            };
        }
        job.done.then(function (points) { return isCurrent && setHeld({ input: input, state: { kind: 'done', points: points } }); }, function (error) {
            if (isCurrent)
                fail(error);
        });
        return function () {
            isCurrent = false;
            job.cancel();
        };
    }, [run, input, attempt]);
    return { state: state, retry: function () { return setAttempt(function (n) { return n + 1; }); } };
};
exports.useGraphLayout = useGraphLayout;
