"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveCard = void 0;
var format_1 = require("../../../../core/domain/format");
var states_1 = require("../../../../core/widgets/states");
var tags_1 = require("../../../../core/widgets/tags");
var en_1 = require("../../../../l10n/en");
var flow_lines_1 = require("../../domain/flow_lines");
var claude_out_1 = require("./claude_out");
// The quest in hand, on Home at full size and on the board in short.
var ActiveCard = function (_a) {
    var active = _a.active, session = _a.session, actions = _a.actions, kind = _a.kind, onDetail = _a.onDetail;
    var started = active.started === null ? null : (0, format_1.dayAndTime)(active.started);
    var waiting = (0, flow_lines_1.askingLine)(active, session.state);
    var isWithCodex = active.codexSince !== null;
    return (<section class={kind === 'full' ? 'quest panel' : 'active-q panel'} aria-labelledby={"active-title-".concat(active.id)}>
      {kind === 'compact' && (<div class="sec-row">
          <h2>{en_1.t.quest.active}</h2>
        </div>)}
      <div class="q-top">
        <span class={active.isBoss ? 'tag boss' : 'tag plain'}>{active.isBoss ? en_1.t.quest.boss : en_1.t.quest.active}</span>
        <span class="q-meta">{en_1.t.quest.inProgress((0, format_1.formatMinutes)(active.minutes), started)}</span>
      </div>
      {kind === 'full' ? (<h1 class="q-title" id={"active-title-".concat(active.id)}>
          {active.title}
        </h1>) : (<p class="aq-title" id={"active-title-".concat(active.id)}>
          <button type="button" class="title-btn" aria-label={en_1.t.detail.openActive(active.title)} onClick={onDetail}>
            {active.title}
          </button>
        </p>)}
      <p class="q-line">
        {active.branch !== null && <span class="mono">{active.branch} · </span>}
        {en_1.t.difficulty[active.difficulty]}
      </p>
      {kind === 'full' && (<div class="q-reward">
          <tags_1.XpReward xp={active.xp}/>
          <tags_1.GoldReward gold={active.xp}/>
          <span class="q-saga">{en_1.t.quest.effort(active.improvingMessages, active.filesChanged)}</span>
        </div>)}
      {isWithCodex ? (<p class="q-status">{en_1.t.quest.withCodex((0, format_1.dayAndTime)(active.codexSince))}</p>) : waiting === null ? (<p class="q-status">{en_1.t.session[session.state]}</p>) : (<ul class="steps" role="status">
          <li>
            <span class="st wait">
              <states_1.Spinner />
            </span>
            {waiting}
          </li>
        </ul>)}
      {!isWithCodex && <claude_out_1.ClaudeOut allowance={session.allowance}/>}
      {active.asking === 'putBack' ? (<div class="q-actions">
          <button type="button" class="btn" onClick={function () { return actions.onBackNow(active); }}>
            {en_1.t.actions.backNow}
          </button>
        </div>) : (<div class="q-actions">
          <button type="button" class="btn primary" onClick={function () { return actions.onOpenClaude(active); }}>
            {isWithCodex ? en_1.t.actions.showCodex : en_1.t.actions.openClaude}
          </button>
          <button type="button" class="btn go" onClick={function () { return actions.onFinish(active); }}>
            {en_1.t.actions.finish}
          </button>
          <button type="button" class="btn" onClick={function () { return actions.onBack(active); }}>
            {en_1.t.actions.back}
          </button>
          <button type="button" class="btn" onClick={function () { return actions.onSealActive(active); }}>
            {en_1.t.actions.seal}
          </button>
          <button type="button" class="btn" onClick={function () { return actions.onContinueIn(active, isWithCodex ? 'claude' : 'codex'); }}>
            {isWithCodex ? en_1.t.actions.continueClaude : en_1.t.actions.continueCodex}
          </button>
          {isWithCodex && (<button type="button" class="btn" onClick={function () { return actions.onContinueIn(active, 'codex'); }}>
              {en_1.t.actions.reopenCodex}
            </button>)}
        </div>)}
    </section>);
};
exports.ActiveCard = ActiveCard;
