"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSession = exports.isFresh = exports.sessionPath = exports.sessionsFolder = exports.STALE_MS = exports.HEARTBEAT_MS = void 0;
exports.HEARTBEAT_MS = 30000;
exports.STALE_MS = 90000;
var sessionsFolder = function (home) { return "".concat(home, "/.queue-tea/sessions"); };
exports.sessionsFolder = sessionsFolder;
var sessionPath = function (home, id) { return "".concat((0, exports.sessionsFolder)(home), "/").concat(id, ".json"); };
exports.sessionPath = sessionPath;
var isFresh = function (session, nowMs) { return nowMs - session.heartbeat <= exports.STALE_MS; };
exports.isFresh = isFresh;
// The session a file holds, or null when it isn't one.
var parseSession = function (text) {
    try {
        var parsed = JSON.parse(text);
        var isWhole = typeof (parsed === null || parsed === void 0 ? void 0 : parsed.id) === 'string' && typeof parsed.projectPath === 'string' && typeof parsed.heartbeat === 'number';
        return isWhole ? parsed : null;
    }
    catch (_a) {
        // Not JSON: it is no session, the same as a file with the wrong shape.
        return null;
    }
};
exports.parseSession = parseSession;
