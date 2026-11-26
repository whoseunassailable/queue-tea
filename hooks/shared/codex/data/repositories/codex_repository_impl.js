"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codexRepositoryImpl = void 0;
var codex_log_source_1 = require("../datasources/codex_log_source");
var codexRepositoryImpl = function (host, home) { return ({
    activitySince: function (folder, sinceMs, nowMs) { return (0, codex_log_source_1.readCodexActivity)(host, home, folder, sinceMs, nowMs); },
}); };
exports.codexRepositoryImpl = codexRepositoryImpl;
