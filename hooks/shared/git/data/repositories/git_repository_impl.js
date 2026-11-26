"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitRepositoryImpl = void 0;
var git_source_1 = require("../datasources/git_source");
var gitRepositoryImpl = function (host, cwd) { return ({
    state: function () { return (0, git_source_1.readGit)(host, cwd); },
    facts: function () { return (0, git_source_1.readFacts)(host, cwd); },
    head: function () { return (0, git_source_1.readHead)(host, cwd); },
    branches: function () { return (0, git_source_1.listBranches)(host, cwd); },
    make: function (branch) { return (0, git_source_1.makeBranch)(host, cwd, branch); },
    switchTo: function (branch) { return (0, git_source_1.switchBranch)(host, cwd, branch); },
    diffSince: function (commit) { return (0, git_source_1.diffSince)(host, cwd, commit); },
    drift: function (task) { return (0, git_source_1.readDrift)(host, cwd, task); },
    commitsBetween: function (from, to) { return (0, git_source_1.commitsBetween)(host, cwd, from, to); },
}); };
exports.gitRepositoryImpl = gitRepositoryImpl;
