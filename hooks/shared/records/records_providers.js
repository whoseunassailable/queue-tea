"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepositoryOf = exports.recordsRepositoryOf = void 0;
var project_repository_impl_1 = require("./data/repositories/project_repository_impl");
var records_repository_impl_1 = require("./data/repositories/records_repository_impl");
var recordsRepositoryOf = function (p, ctx) { return (0, records_repository_impl_1.recordsRepositoryImpl)(p.host, ctx); };
exports.recordsRepositoryOf = recordsRepositoryOf;
var projectRepositoryOf = function (p) { return (0, project_repository_impl_1.projectRepositoryImpl)(p.host, p.log); };
exports.projectRepositoryOf = projectRepositoryOf;
