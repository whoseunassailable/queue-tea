"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var graph_layout_1 = require("./graph_layout");
(0, vitest_1.afterEach)(preact_1.cleanup);
// A layout whose progress, result and failure the test hands out itself.
var fakeRun = function () {
    var runs = [];
    var run = vitest_1.vi.fn(function (input, onProgress) {
        var finish;
        var fail;
        var done = new Promise(function (resolve, reject) {
            finish = resolve;
            fail = reject;
        });
        var cancel = vitest_1.vi.fn();
        runs.push({ input: input, onProgress: onProgress, finish: finish, fail: fail, cancel: cancel });
        return { done: done, cancel: cancel };
    });
    return { run: run, runs: runs };
};
// Lets every promise callback waiting on a settled run go first.
var settle = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
var inputOf = function () {
    var _a;
    var ids = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ids[_i] = arguments[_i];
    }
    return ({ ids: ids, edges: [], centre: (_a = ids[0]) !== null && _a !== void 0 ? _a : null, start: new Map() });
};
(0, vitest_1.it)('shows progress, then the points', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, run, runs, input, result, points;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                input = inputOf('a', 'b');
                result = (0, preact_1.renderHook)(function () { return (0, graph_layout_1.useGraphLayout)(run, input, vitest_1.vi.fn()); }).result;
                (0, vitest_1.expect)(run).toHaveBeenCalledWith(input, vitest_1.expect.any(Function));
                (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0 });
                (0, preact_1.act)(function () { return runs[0].onProgress(0.5); });
                (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0.5 });
                points = new Map([['a', { x: 0, y: 0 }], ['b', { x: 60, y: 0 }]]);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, runs[0].finish(points)];
                    }); }); })];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'done', points: points }); })];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('cancels the old run when the input changes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, run, runs, first, second, _b, result, rerender, points;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                first = inputOf('a');
                second = inputOf('b');
                _b = (0, preact_1.renderHook)(function (input) { return (0, graph_layout_1.useGraphLayout)(run, input, vitest_1.vi.fn()); }, { initialProps: first }), result = _b.result, rerender = _b.rerender;
                rerender(second);
                (0, vitest_1.expect)(runs).toHaveLength(2);
                (0, vitest_1.expect)(runs[1].input).toBe(second);
                (0, vitest_1.expect)(runs[0].cancel).toHaveBeenCalled();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    runs[0].finish(new Map([['a', { x: 5, y: 5 }]]));
                                    return [4 /*yield*/, settle()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _c.sent();
                (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0 });
                points = new Map([['b', { x: 0, y: 0 }]]);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, runs[1].finish(points)];
                    }); }); })];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'done', points: points }); })];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('reads as laying from the first render with a new input', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, run, runs, first, second, seen, _b, result, rerender, kinds;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                first = inputOf('a');
                second = inputOf('b');
                seen = [];
                _b = (0, preact_1.renderHook)(function (input) {
                    var layout = (0, graph_layout_1.useGraphLayout)(run, input, vitest_1.vi.fn());
                    seen.push([input, layout.state.kind]);
                    return layout;
                }, { initialProps: first }), result = _b.result, rerender = _b.rerender;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, runs[0].finish(new Map([['a', { x: 0, y: 0 }]]))];
                    }); }); })];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(result.current.state.kind).toBe('done'); })];
            case 2:
                _c.sent();
                rerender(second);
                kinds = seen.filter(function (_a) {
                    var input = _a[0];
                    return input === second;
                }).map(function (_a) {
                    var kind = _a[1];
                    return kind;
                });
                (0, vitest_1.expect)(kinds[0]).toBe('laying');
                (0, vitest_1.expect)(kinds).not.toContain('done');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('logs a failure and lays out again on retry', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, run, runs, input, log, result, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                input = inputOf('a');
                log = vitest_1.vi.fn();
                result = (0, preact_1.renderHook)(function () { return (0, graph_layout_1.useGraphLayout)(run, input, log); }).result;
                error = new Error('boom');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    runs[0].fail(error);
                                    return [4 /*yield*/, settle()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _b.sent();
                (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'failed' });
                (0, vitest_1.expect)(log).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(log.mock.calls[0][0]).toContain('graph layout');
                (0, vitest_1.expect)(log.mock.calls[0][0]).toContain(error.stack);
                (0, preact_1.act)(function () { return result.current.retry(); });
                (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                (0, vitest_1.expect)(run).toHaveBeenLastCalledWith(input, vitest_1.expect.any(Function));
                (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0 });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a run that throws while starting gives the failed state and logs the stack', function () {
    var error = new Error('no worker');
    var run = vitest_1.vi.fn(function () {
        throw error;
    });
    var log = vitest_1.vi.fn();
    var input = inputOf('a');
    var result = (0, preact_1.renderHook)(function () { return (0, graph_layout_1.useGraphLayout)(run, input, log); }).result;
    (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'failed' });
    (0, vitest_1.expect)(log).toHaveBeenCalledTimes(1);
    (0, vitest_1.expect)(log.mock.calls[0][0]).toContain('graph layout');
    (0, vitest_1.expect)(log.mock.calls[0][0]).toContain(error.stack);
});
(0, vitest_1.it)('does nothing for a null input', function () {
    var run = fakeRun().run;
    (0, preact_1.renderHook)(function () { return (0, graph_layout_1.useGraphLayout)(run, null, vitest_1.vi.fn()); });
    (0, vitest_1.expect)(run).not.toHaveBeenCalled();
});
(0, vitest_1.it)('shows points that are ready for the input as done, without a run, and a retry then runs', function () {
    var run = fakeRun().run;
    var input = inputOf('a', 'b');
    var ready = new Map([['a', { x: 0, y: 0 }], ['b', { x: 60, y: 0 }]]);
    var result = (0, preact_1.renderHook)(function () { return (0, graph_layout_1.useGraphLayout)(run, input, vitest_1.vi.fn(), ready); }).result;
    (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'done', points: ready });
    (0, vitest_1.expect)(run).not.toHaveBeenCalled();
    (0, preact_1.act)(function () { return result.current.retry(); });
    (0, vitest_1.expect)(run).toHaveBeenCalledWith(input, vitest_1.expect.any(Function));
    (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0 });
});
(0, vitest_1.it)('lays out a later input even when the first had ready points', function () {
    var run = fakeRun().run;
    var ready = new Map([['a', { x: 0, y: 0 }]]);
    var next = inputOf('a', 'b');
    var _a = (0, preact_1.renderHook)(function (input) { return (0, graph_layout_1.useGraphLayout)(run, input, vitest_1.vi.fn(), ready); }, { initialProps: inputOf('a') }), result = _a.result, rerender = _a.rerender;
    (0, vitest_1.expect)(run).not.toHaveBeenCalled();
    rerender(next);
    (0, vitest_1.expect)(run).toHaveBeenCalledTimes(1);
    (0, vitest_1.expect)(run).toHaveBeenCalledWith(next, vitest_1.expect.any(Function));
    (0, vitest_1.expect)(result.current.state).toEqual({ kind: 'laying', share: 0 });
});
