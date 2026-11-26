"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskLogRepositoryImpl = void 0;
var docs_log_source_1 = require("../datasources/docs_log_source");
var taskLogRepositoryImpl = function (host, projectPath) { return ({
    add: function (logPath, row, day) { return (0, docs_log_source_1.writeDocsLog)(host, projectPath, logPath, row, day); },
}); };
exports.taskLogRepositoryImpl = taskLogRepositoryImpl;
