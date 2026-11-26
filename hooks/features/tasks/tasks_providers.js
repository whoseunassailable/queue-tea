"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksDepsOf = void 0;
var codex_providers_1 = require("../../shared/codex/codex_providers");
var git_providers_1 = require("../../shared/git/git_providers");
var records_providers_1 = require("../../shared/records/records_providers");
var task_log_repository_impl_1 = require("./data/repositories/task_log_repository_impl");
var tasksDepsOf = function (p, ctx) { return ({
    records: (0, records_providers_1.recordsRepositoryOf)(p, ctx),
    git: (0, git_providers_1.gitRepositoryOf)(p, ctx),
    taskLog: (0, task_log_repository_impl_1.taskLogRepositoryImpl)(p.host, ctx.cwd),
    codex: (0, codex_providers_1.codexRepositoryOf)(p, ctx),
    env: p,
}); };
exports.tasksDepsOf = tasksDepsOf;
