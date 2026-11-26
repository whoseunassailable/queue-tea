"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRepositoryOf = void 0;
var sessions_repository_impl_1 = require("./data/repositories/sessions_repository_impl");
var sessionsRepositoryOf = function (p, ctx) { return (0, sessions_repository_impl_1.sessionsRepositoryImpl)(p.host, ctx.home); };
exports.sessionsRepositoryOf = sessionsRepositoryOf;
