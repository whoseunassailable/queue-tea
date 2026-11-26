"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedRecord = void 0;
var window_keys_1 = require("../../../../core/widgets/window_keys");
var en_1 = require("../../../../l10n/en");
var quest_keys_1 = require("../../../quests/presentation/state_management/quest_keys");
var sentenceOf = function (reason) { return "".concat(reason.charAt(0).toUpperCase()).concat(reason.slice(1), "."); };
// Stands in for every tab of a realm whose record doesn't read. The reason is
// the engine's own, and the record stays exactly as it is.
var FailedRecord = function (_a) {
    var view = _a.view, letterKeys = _a.letterKeys, isSheetOpen = _a.isSheetOpen, onRestore = _a.onRestore, onRetry = _a.onRetry, onShow = _a.onShow, onCopy = _a.onCopy;
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (isSheetOpen || (0, quest_keys_1.isTyping)(event.target) || event.metaKey || (!letterKeys && (0, quest_keys_1.isLetterKey)(event.key)))
            return;
        if (event.key === 'l' && view.canRestore)
            onRestore();
        else if (event.key === 'r')
            onRetry();
    });
    return (<main class="page">
      <section class="mcard panel" aria-labelledby="failed-h">
        <h1 class="q-title" id="failed-h">
          <span aria-hidden="true">⚠ </span>
          {en_1.t.failedRecord.title}
        </h1>
        <p>{sentenceOf(view.reason)}</p>
        <p class="card-note">{view.canRestore ? en_1.t.failedRecord.leftWithCopy : en_1.t.failedRecord.left}</p>
        <span class="copy-line">
          <code>{view.file}</code>
          <button type="button" class="icon-btn" aria-label={en_1.t.flow.copy} onClick={function () { return onCopy(view.file); }}>
            ⧉
          </button>
        </span>
        {view.isNewer && <p class="card-note">{en_1.t.failedRecord.newerNote}</p>}
        <div class="q-actions">
          {view.canRestore && (<button type="button" class="btn primary" onClick={onRestore}>
              {en_1.t.failedRecord.restore}
            </button>)}
          <button type="button" class={view.canRestore ? 'btn' : 'btn primary'} onClick={onRetry}>
            {en_1.t.failed.tryAgain}
          </button>
          <button type="button" class="btn" onClick={onShow}>
            {en_1.t.settings.showInFinder}
          </button>
        </div>
      </section>
      <p class="hint">{"".concat(en_1.t.failedRecord.noChange(view.name), " ").concat(en_1.t.failedRecord.others)}</p>
    </main>);
};
exports.FailedRecord = FailedRecord;
