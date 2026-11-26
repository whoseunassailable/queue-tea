"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitRepositoryOf = void 0;
var git_repository_impl_1 = require("./data/repositories/git_repository_impl");
var gitRepositoryOf = function (p, ctx) { return (0, git_repository_impl_1.gitRepositoryImpl)(p.host, ctx.cwd); };
exports.gitRepositoryOf = gitRepositoryOf;
