"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
var hooks_1 = require("preact/hooks");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var routes_1 = require("../../../../config/routing/routes");
var constants_1 = require("../../../../core/constants/constants");
var format_1 = require("../../../../core/domain/format");
var art_1 = require("../../../../core/widgets/art");
var tags_1 = require("../../../../core/widgets/tags");
var en_1 = require("../../../../l10n/en");
var board_1 = require("../../../quests/domain/board");
var flow_keys_1 = require("../../../quests/presentation/state_management/flow_keys");
var quest_keys_1 = require("../../../quests/presentation/state_management/quest_keys");
var active_card_1 = require("../../../quests/presentation/widgets/active_card");
var claude_out_1 = require("../../../quests/presentation/widgets/claude_out");
var board_tools_1 = require("../../../quests/presentation/widgets/board_tools");
var empty_board_1 = require("../../../quests/presentation/widgets/empty_board");
var flow_card_1 = require("../../../quests/presentation/widgets/flow_card");
var judgement_card_1 = require("../../../quests/presentation/widgets/judgement_card");
var Lair = function (_a) {
    var game = _a.game, session = _a.session, onPet = _a.onPet;
    var stage = game.status === 'ready' ? game.data.stage : 'hatchling';
    return (<section class="lair" aria-label={en_1.t.dragon.plaque(en_1.t.stage[stage])}>
      <art_1.Dragon stage={stage} onPet={onPet}/>
      <div class="plaque panel">
        <span class="plaque-name">{en_1.t.dragon.plaque(en_1.t.stage[stage])}</span>
        {game.status === 'ready' && <span class="plaque-sub">{en_1.t.dragon.level(game.data.level, constants_1.GROWS_AT[stage])}</span>}
        <span class="plaque-mood">{en_1.t.mood[session]}</span>
      </div>
    </section>);
};
var mainQuest = function (view) { var _a; return (_a = (0, board_1.rowsOf)(view.ready).find(function (r) { return r.quest.isStar; })) === null || _a === void 0 ? void 0 : _a.quest; };
var NoActive = function (_a) {
    var view = _a.view, actions = _a.actions;
    var next = mainQuest(view);
    return (<section class="quest panel" aria-labelledby="active-title">
      <h1 class="q-title" id="active-title">
        {en_1.t.quest.noneTitle}
      </h1>
      <p class="q-line">{next === undefined ? en_1.t.quest.noneEmpty : en_1.t.quest.noneLine(next.title)}</p>
      {(next === null || next === void 0 ? void 0 : next.why) != null && <p class="hint">★ {next.why}</p>}
      <p class="q-status">{en_1.t.session[view.session.state]}</p>
      {next !== undefined && <claude_out_1.ClaudeOut allowance={view.session.allowance}/>}
      {next !== undefined && (<div class="q-actions">
          <button type="button" class="btn primary" onClick={function () { return actions.onStart(next); }}>
            {en_1.t.actions.startNamed(next.title)}
          </button>
          <button type="button" class="btn" onClick={function () { return actions.onStart(next, 'codex'); }}>
            {en_1.t.actions.startCodex}
          </button>
        </div>)}
    </section>);
};
var Board = function (_a) {
    var view = _a.view, actions = _a.actions, onNewQuest = _a.onNewQuest;
    var rows = (0, board_1.rowsOf)(view.ready)
        .filter(function (r) { return !r.isChapter || r.quest.isStar; })
        .slice(0, constants_1.HOME_BOARD_ROWS);
    var total = view.canStart + view.sealedCount;
    return (<section class="board panel" aria-labelledby="b-title">
      <div class="sec-h">
        <h2 id="b-title">{en_1.t.board.title}</h2>
        <span class="sec-sub">{en_1.t.board.counts(view.canStart, view.sealedCount)}</span>
        <board_tools_1.TimeControl budget={view.budget} onStep={actions.onStepBudget}/>
      </div>
      {view.active !== null && total > 0 && <p class="hint">{en_1.t.board.startHint}</p>}
      {total === 0 && <empty_board_1.EmptyBoard onNewQuest={onNewQuest}/>}
      {total > 0 && view.canStart === 0 && <p class="hint">{en_1.t.empty.allSealed}</p>}
      {rows.map(function (row) { return (<div key={row.quest.id} class={row.quest.isStar ? 'qcard main-q' : 'qcard'}>
          {row.quest.isStar && (<span class="q-star" role="img" aria-label={en_1.t.board.mainQuest}>
              ★
            </span>)}
          <span class="qc-body">
            <span class="qc-title">{row.quest.title}</span>
            <span class="qc-sub">{(0, board_1.metaOf)(row)}</span>
          </span>
          <span class="qc-side">
            <tags_1.PriorityTag priority={row.quest.priority}/>
            <tags_1.XpReward xp={row.quest.xp}/>
          </span>
        </div>); })}
      {total > 0 && (<a class="more" href={(0, routes_1.hrefOf)(routes_1.ROUTES.quests)}>
          {en_1.t.board.all(total)}
        </a>)}
    </section>);
};
var Glory = function (_a) {
    var view = _a.view, game = _a.game;
    return (<section class="glory panel" aria-labelledby="g-title">
    <div class="sec-h">
      <h2 id="g-title">{en_1.t.glory.title}</h2>
      {game.status === 'ready' && <span class="sec-sub">{en_1.t.glory.line(game.data.victories)}</span>}
    </div>
    {view.victories.length === 0 && <p class="hint">{game.status === 'ready' && game.data.victories > 0 ? en_1.t.empty.noVictoriesHere : en_1.t.empty.noVictories}</p>}
    {view.victories.map(function (v) { return (<p key={v.id} class="victory-row">
        <span>{v.title}</span>
        <span class="v-meta">{en_1.t.glory.victory((0, format_1.dayOf)(v.finished), (0, format_1.formatMinutes)(v.minutes), v.xp)}</span>
      </p>); })}
    {game.status === 'ready' && (<ul class="badges" aria-label={en_1.t.glory.badges}>
        {__spreadArray([], game.data.badges, true).sort(function (a, b) { return Number(b.earnedOn !== null) - Number(a.earnedOn !== null); })
                .slice(0, constants_1.HOME_BADGES)
                .map(function (badge) { return (<li key={badge.id} class={badge.earnedOn === null ? 'badge' : 'badge got'}>
              <span>
                <b>{en_1.t.badges[badge.id]}</b>
                <i>{badge.earnedOn === null ? en_1.t.glory.progress(badge.have, badge.need) : en_1.t.glory.earned((0, format_1.dayOf)(badge.earnedOn))}</i>
              </span>
            </li>); })}
      </ul>)}
  </section>);
};
var QuestCard = function (_a) {
    var view = _a.view, flow = _a.flow, actions = _a.actions;
    if (flow !== undefined)
        return <flow_card_1.FlowCard flow={flow} actions={actions}/>;
    if (view.active === null)
        return <NoActive view={view} actions={actions}/>;
    return <>{view.activeQuests.map(function (active) {
            var _a;
            return active.review !== null
                ? <judgement_card_1.JudgementCard key={active.id} active={active} actions={actions} kind="full"/>
                : <active_card_1.ActiveCard key={active.id} active={active} session={(_a = active.session) !== null && _a !== void 0 ? _a : view.session} actions={actions} kind="full"/>;
        })}</>;
};
var LiveLines = function (_a) {
    var live = _a.live, note = _a.note, onSwitch = _a.onSwitch;
    return (<>
    {live === null || live === void 0 ? void 0 : live.drift.map(function (line) { return (<p key={line} class="live-line">
        ! {line}
      </p>); })}
    {(live === null || live === void 0 ? void 0 : live.mismatch) != null && (<p class="live-line">
        {live.mismatch.uncommitted === null ? en_1.t.live.mismatch(live.mismatch.on, live.mismatch.branch) : en_1.t.live.mismatchHeld(live.mismatch.on, live.mismatch.branch)}
        {live.mismatch.uncommitted === null && (<button type="button" class="chip-btn" onClick={onSwitch}>
            {en_1.t.live.switch}
          </button>)}
      </p>)}
    {note !== null && <p class="hint">{note}</p>}
  </>);
};
var HomePage = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, view = _a.view, game = _a.game, flow = _a.flow, actions = _a.actions, isSheetOpen = _a.isSheetOpen, letterKeys = _a.letterKeys, onPet = _a.onPet, onNewQuest = _a.onNewQuest, onSwitch = _a.onSwitch;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readLive(view.key); }, [view.key, (_b = view.active) === null || _b === void 0 ? void 0 : _b.id, (_c = view.active) === null || _c === void 0 ? void 0 : _c.branch]);
    var _e = (0, hooks_1.useState)(null), dismissed = _e[0], setDismissed = _e[1];
    var live = read.load.status === 'ready' ? read.load.data : null;
    var failure = (_d = read.note) !== null && _d !== void 0 ? _d : (read.load.status === 'failed' ? read.load.message : null);
    var warning = (live === null || live === void 0 ? void 0 : live.warning) != null && live.warning !== dismissed ? live.warning : null;
    var switchBranch = function () {
        var _a;
        if (((_a = live === null || live === void 0 ? void 0 : live.mismatch) === null || _a === void 0 ? void 0 : _a.uncommitted) === null)
            void onSwitch(live.mismatch.branch).then(function (isDone) { return isDone && read.refresh(); });
    };
    (0, quest_keys_1.useQuestKeys)(!isSheetOpen, letterKeys, function (key) {
        if ((0, flow_keys_1.runFlowKey)(key, view, flow, actions))
            return true;
        var next = mainQuest(view);
        if (key.kind === 'start' && next !== undefined)
            actions.onStart(next);
        else if (key.kind === 'seal' && view.active !== null)
            actions.onSealActive(view.active);
        else if (key.kind === 'switch')
            switchBranch();
        else if (key.kind === 'dismiss' && warning !== null)
            setDismissed(warning);
        else
            return false;
        return true;
    });
    return (<main class="stage">
      <div class="col-left">
        <Lair game={game} session={view.session.state} onPet={onPet}/>
        {warning !== null && (<div class="warning-strip panel" role="alert">
            <span class="grow">{warning}</span>
            <button type="button" class="chip-btn" onClick={function () { return setDismissed(warning); }}>
              {en_1.t.actions.ok}
            </button>
          </div>)}
        <QuestCard view={view} flow={flow} actions={actions}/>
        <LiveLines live={live} note={failure} onSwitch={switchBranch}/>
      </div>
      <div class="col-right">
        <Board view={view} actions={actions} onNewQuest={onNewQuest}/>
        <Glory view={view} game={game}/>
      </div>
    </main>);
};
exports.HomePage = HomePage;
