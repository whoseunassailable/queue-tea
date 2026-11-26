"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordsRepositoryImpl = void 0;
var record_source_1 = require("../datasources/record_source");
var recordsRepositoryImpl = function (host, ctx) { return ({
    read: function () { return (0, record_source_1.readRecord)(host, ctx.file, ctx.projectName, ctx.projectPath); },
    update: function (fn) { return (0, record_source_1.updateRecord)(host, ctx.file, fn, ctx.projectName, ctx.projectPath); },
    problem: function () { return (0, record_source_1.readProblem)(host, ctx.file); },
    restore: function (stamp) { return (0, record_source_1.restoreRecord)(host, ctx.file, stamp); },
    others: function (title) { return (0, record_source_1.readOthers)(host, ctx.file, title); },
}); };
exports.recordsRepositoryImpl = recordsRepositoryImpl;
