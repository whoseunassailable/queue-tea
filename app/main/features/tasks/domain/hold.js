"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdCommandOf = exports.holdKindOf = void 0;
// What the engine's hold is about. The sentence is the engine's; this picks
// the advice and the command that go with it.
var holdKindOf = function (git) {
    if (git.isDetached)
        return 'detached';
    if (git.uncommitted > 0)
        return 'uncommitted';
    return git.hasUpstream ? 'unpushed' : 'neverPushed';
};
exports.holdKindOf = holdKindOf;
// Text to copy. The app never runs these.
var holdCommandOf = function (git) {
    var kind = (0, exports.holdKindOf)(git);
    if (kind === 'detached')
        return 'git switch <branch>';
    if (kind === 'uncommitted')
        return 'git status';
    return kind === 'unpushed' ? 'git push' : "git push -u origin ".concat(git.branch);
};
exports.holdCommandOf = holdCommandOf;
