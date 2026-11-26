"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamProcess = exports.stopProcesses = void 0;
var node_child_process_1 = require("node:child_process");
var OUTPUT_LIMIT = 64000;
var KILL_GRACE_MS = 2000;
var running = new Set();
var stopProcesses = function () { for (var _i = 0, running_1 = running; _i < running_1.length; _i++) {
    var stop_1 = running_1[_i];
    stop_1();
} };
exports.stopProcesses = stopProcesses;
// One process group per user action. Stream before exit; stop children too on
// cancellation/timeouts. Output stays bounded even for a very noisy command.
var streamProcess = function (log, request, output) { return new Promise(function (resolve) {
    var _a, _b;
    var stdout = '';
    var stderr = '';
    var stopped = false;
    var settled = false;
    var timedOut = false;
    var child = (0, node_child_process_1.spawn)(request.argv[0], request.argv.slice(1), { cwd: request.cwd, env: __assign(__assign({}, process.env), request.env), detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    var force;
    var kill = function (signal) {
        try {
            if (child.pid)
                process.platform === 'win32' ? child.kill(signal) : process.kill(-child.pid, signal);
        }
        catch (err) {
            if (err.code !== 'ESRCH')
                log.error('stopping a process failed', err);
        }
    };
    var stop = function () {
        if (stopped || settled)
            return;
        stopped = true;
        kill('SIGTERM');
        force = setTimeout(function () { return kill('SIGKILL'); }, KILL_GRACE_MS);
    };
    running.add(stop);
    var timeout = request.timeoutMs ? setTimeout(function () {
        if (stopped || settled)
            return;
        timedOut = true;
        stop();
    }, request.timeoutMs) : undefined;
    var finish = function (exitCode) {
        var _a;
        if (settled)
            return;
        settled = true;
        running.delete(stop);
        clearTimeout(timeout);
        clearTimeout(force);
        (_a = request.signal) === null || _a === void 0 ? void 0 : _a.removeEventListener('abort', stop);
        resolve(__assign({ exitCode: stopped ? 130 : exitCode, stdout: stdout, stderr: stderr }, (timedOut ? { timedOut: true } : {})));
    };
    var chunk = function (text, isError) {
        if (isError)
            stderr = (stderr + text).slice(-OUTPUT_LIMIT);
        else
            stdout = (stdout + text).slice(-OUTPUT_LIMIT);
        try {
            output === null || output === void 0 ? void 0 : output(text);
        }
        catch (err) {
            log.error('streaming process output failed', err);
            stop();
        }
    };
    child.stdout.setEncoding('utf8').on('data', function (text) { return chunk(text, false); });
    child.stderr.setEncoding('utf8').on('data', function (text) { return chunk(text, true); });
    child.on('error', function (err) { log.error('starting a process failed', err); stderr = err.message; finish(1); });
    child.on('close', function (code) { return finish(code !== null && code !== void 0 ? code : 1); });
    (_a = request.signal) === null || _a === void 0 ? void 0 : _a.addEventListener('abort', stop, { once: true });
    if ((_b = request.signal) === null || _b === void 0 ? void 0 : _b.aborted)
        stop();
}); };
exports.streamProcess = streamProcess;
