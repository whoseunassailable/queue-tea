"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyBoard = void 0;
var en_1 = require("../../../../l10n/en");
// A board with nothing on it says so, and offers the way to fill it.
var EmptyBoard = function (_a) {
    var onNewQuest = _a.onNewQuest;
    return (<div class="empty-board">
    <p class="hint">
      {en_1.t.empty.boardTitle}. {en_1.t.empty.boardLine}
    </p>
    <button type="button" class="btn" onClick={onNewQuest}>
      {en_1.t.empty.fileOne}
    </button>
  </div>);
};
exports.EmptyBoard = EmptyBoard;
