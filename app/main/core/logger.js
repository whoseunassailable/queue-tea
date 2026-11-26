"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSink = exports.createLogger = void 0;
var promises_1 = require("node:fs/promises");
var stackOf = function (err) { var _a; return (err instanceof Error ? ((_a = err.stack) !== null && _a !== void 0 ? _a : err.message) : String(err)); };
// The one logger. Dev writes everything; stage and prod warnings and errors.
var createLogger = function (flavor, write) {
    var line = function (level, text) { return write("".concat(new Date().toISOString(), " ").concat(level, " ").concat(text, "\n")); };
    return {
        debug: function (text) {
            if (flavor === 'dev')
                line('debug', text);
        },
        warn: function (text) { return line('warn', text); },
        error: function (text, err) { return line('error', err === undefined ? text : "".concat(text, "\n").concat(stackOf(err))); },
    };
};
exports.createLogger = createLogger;
// Lines go to a file, and to the terminal in dev. A log that can't be written
// has nowhere to report to, so it is dropped.
var fileSink = function (file, flavor) { return function (line) {
    if (flavor === 'dev')
        process.stderr.write(line);
    (0, promises_1.appendFile)(file, line).catch(function () { });
}; };
exports.fileSink = fileSink;
