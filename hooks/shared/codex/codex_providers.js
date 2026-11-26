"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codexRepositoryOf = void 0;
var codex_repository_impl_1 = require("./data/repositories/codex_repository_impl");
var codexRepositoryOf = function (p, ctx) { return (0, codex_repository_impl_1.codexRepositoryImpl)(p.host, ctx.home); };
exports.codexRepositoryOf = codexRepositoryOf;
