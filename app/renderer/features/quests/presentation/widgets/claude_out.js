"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeOut = void 0;
var format_1 = require("../../../../core/domain/format");
var en_1 = require("../../../../l10n/en");
// Beside Start and on a Claude quest, when Claude's allowance has run out.
// Claude stays the first button: this only says Codex is there.
var ClaudeOut = function (_a) {
    var allowance = _a.allowance;
    return allowance !== null && (0, format_1.isClaudeOut)(allowance, Date.now()) ? <p class="hint">! {en_1.t.quest.claudeOut((0, format_1.refillTime)(allowance))}</p> : null;
};
exports.ClaudeOut = ClaudeOut;
