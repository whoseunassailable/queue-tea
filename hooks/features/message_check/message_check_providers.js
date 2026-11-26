"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRepositoryOf = void 0;
var check_repository_impl_1 = require("./data/repositories/check_repository_impl");
var checkRepositoryOf = function (p) { return (0, check_repository_impl_1.checkRepositoryImpl)(p); };
exports.checkRepositoryOf = checkRepositoryOf;
