"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitModeOf = exports.isGitMode = exports.GIT_MODES = void 0;
exports.GIT_MODES = ['manual', 'assisted'];
var isGitMode = function (value) { return exports.GIT_MODES.includes(value); };
exports.isGitMode = isGitMode;
// A record made before Git modes has none, and works as Assisted.
var gitModeOf = function (record) { return (record.gitMode === 'manual' ? 'manual' : 'assisted'); };
exports.gitModeOf = gitModeOf;
