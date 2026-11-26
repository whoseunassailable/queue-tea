"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepositoryImpl = void 0;
var project_source_1 = require("../datasources/project_source");
var projectRepositoryImpl = function (host, log) { return ({
    locate: function (cwd, home) { return (0, project_source_1.readProjectPlace)(host, cwd, home, log); },
}); };
exports.projectRepositoryImpl = projectRepositoryImpl;
