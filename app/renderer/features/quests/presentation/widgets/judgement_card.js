"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgementCard = void 0;
var format_1 = require("../../../../core/domain/format");
var tags_1 = require("../../../../core/widgets/tags");
var en_1 = require("../../../../l10n/en");
// Claude says the quest looks done, and only Rohan can say so.
var JudgementCard = function (_a) {
    var _b, _c;
    var active = _a.active, actions = _a.actions, kind = _a.kind;
    var checked = (_c = (_b = active.review) === null || _b === void 0 ? void 0 : _b.checked) !== null && _c !== void 0 ? _c : null;
    return (<section class={kind === 'full' ? 'quest panel' : 'active-q panel'} aria-label={en_1.t.judgement.label}>
      <div class="q-top">
        <tags_1.PriorityTag priority={active.priority}/>
        <span class="q-meta">{en_1.t.judgement.meta((0, format_1.formatMinutes)(active.minutes), active.branch, en_1.t.difficulty[active.difficulty])}</span>
      </div>
      <h1 class="q-title">{en_1.t.judgement.ask(active.title)}</h1>
      {checked !== null && (<p class="card-note">
          <b>{en_1.t.judgement.checked}</b> {checked}
        </p>)}
      {active.criteria.length > 0 && (<ul class="chapters">
          {active.criteria.map(function (line) { return (<li key={line}>{line}</li>); })}
        </ul>)}
      <div class="q-actions">
        <button type="button" class="btn primary" onClick={function () { return actions.onFinish(active); }}>
          {en_1.t.judgement.yes}
        </button>
        <button type="button" class="btn" onClick={function () { return actions.onNotYet(active); }}>
          {en_1.t.judgement.no}
        </button>
        <button type="button" class="btn" onClick={function () { return actions.onOpenClaude(active); }}>
          {active.codexSince !== null ? en_1.t.actions.showCodex : en_1.t.actions.openClaude}
        </button>
      </div>
    </section>);
};
exports.JudgementCard = JudgementCard;
