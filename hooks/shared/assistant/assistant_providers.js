"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantRepositoryOf = void 0;
var assistant_repository_impl_1 = require("./data/repositories/assistant_repository_impl");
var assistantRepositoryOf = function (p) { return (0, assistant_repository_impl_1.assistantRepositoryImpl)(p); };
exports.assistantRepositoryOf = assistantRepositoryOf;
