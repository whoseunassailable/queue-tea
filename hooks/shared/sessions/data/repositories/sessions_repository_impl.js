"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRepositoryImpl = void 0;
var session_source_1 = require("../datasources/session_source");
var sessionsRepositoryImpl = function (host, home) { return ({
    write: function (session) { return (0, session_source_1.writeSessionFile)(host, home, session); },
    remove: function (id) { return (0, session_source_1.removeSessionFile)(host, home, id); },
    list: function () { return (0, session_source_1.readSessions)(host, home); },
}); };
exports.sessionsRepositoryImpl = sessionsRepositoryImpl;
