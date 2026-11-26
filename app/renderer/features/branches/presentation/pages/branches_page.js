"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchesPage = void 0;
var hooks_1 = require("preact/hooks");
var routes_1 = require("../../../../config/routing/routes");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var read_view_1 = require("../../../../core/widgets/read_view");
var en_1 = require("../../../../l10n/en");
var flow_card_1 = require("../../../quests/presentation/widgets/flow_card");
var constants_1 = require("../../domain/constants");
var branch_graph_1 = require("../widgets/branch_graph");
var branch_review_1 = require("../widgets/branch_review");
var free_space_1 = require("../widgets/free_space");
var BranchesPage = function (_a) {
    var view = _a.view, actions = _a.actions, engine = _a.engine, flow = _a.flow, onOpen = _a.onOpen;
    var _b = (0, hooks_1.useState)(null), selected = _b[0], setSelected = _b[1];
    var _c = (0, hooks_1.useState)('all'), filter = _c[0], setFilter = _c[1];
    var _d = (0, hooks_1.useState)(false), isFreeing = _d[0], setFreeing = _d[1];
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readBranches(view.key); }, [view.key]);
    (0, hooks_1.useEffect)(function () { if (selected || isFreeing)
        return; var timer = window.setInterval(read.refresh, constants_1.BRANCH_POLL_MS); return function () { return window.clearInterval(timer); }; }, [read.refresh, selected, isFreeing]);
    (0, hooks_1.useEffect)(function () { setSelected(null); setFreeing(false); }, [view.key]);
    return <main class="branch-page">
    <header class="panel branch-heading">
      <div class="sec-row"><h1>{en_1.t.branches.title}</h1><button type="button" class="btn" onClick={read.refresh}>{en_1.t.branches.refresh}</button></div>
      <p>{en_1.t.branches.line}</p>
      <p class="hint">{en_1.t.branches.active(view.activeQuests.length)}</p>
      <div class="q-actions"><a class="btn" href={(0, routes_1.hrefOf)(routes_1.ROUTES.quests)}>{en_1.t.nav.quests}</a><button type="button" class="btn" onClick={function () { return setFreeing(true); }}>{en_1.t.branches.space.open}</button></div>
    </header>
    {flow && <flow_card_1.FlowCard flow={flow} actions={actions}/>}
    <read_view_1.ReadView read={read} line={en_1.t.branches.reading}>{function (graph) { return <>
      <p class="hint" role="status">{en_1.t.branches.observed(graph.at)}</p>
      {graph.tasks.length === 0 ? <p class="panel branch-heading">{en_1.t.branches.empty}</p> : <>
        <branch_graph_1.BranchGraph graph={graph} onSelect={setSelected}/>
        <label class="branch-filter">{en_1.t.branches.filter}<select value={filter} onChange={function (e) { return setFilter(e.currentTarget.value); }}><option value="all">{en_1.t.branches.all}</option>{Object.keys(en_1.t.branches.states).map(function (state) { return <option key={state} value={state}>{en_1.t.branches.states[state]}</option>; })}</select></label>
        <ul class="branch-cards">{graph.tasks.filter(function (q) { return filter === 'all' || q.state === filter; }).map(function (quest) {
                    var _a;
                    var active = view.activeQuests.find(function (q) { return q.id === quest.id; });
                    return <li key={quest.id}><article class={"panel branch-card ".concat(quest.state)} aria-label={quest.title}>
            <div class="sec-row"><span class={"branch-state ".concat(quest.state === 'working' ? 'observed-working' : '')}>{en_1.t.branches.states[quest.state]}</span></div>
            <h3><button type="button" class="title-btn" onClick={function () { return setSelected(quest.id); }}>{quest.title}</button></h3>
            <p class="mono">{quest.branch} → {(_a = quest.base) !== null && _a !== void 0 ? _a : en_1.t.branches.unknown}</p>
            <p class="hint">{quest.head ? en_1.t.branches.counts(quest.commits, quest.changed) : en_1.t.branches.missingRef}</p>
            {quest.fork && <p class="hint">{en_1.t.branches.fork(quest.fork)}</p>}
            {quest.latest && <p class="branch-latest mono">{quest.latest}</p>}
            <div class="q-actions">
              <button type="button" class="btn primary" onClick={function () { return setSelected(quest.id); }}>{en_1.t.branches.review}</button>
              {active && <button type="button" class="btn" disabled={(flow === null || flow === void 0 ? void 0 : flow.kind) === 'working'} onClick={function () { return actions.onOpenClaude(active); }}>{active.codexSince ? en_1.t.actions.showCodex : en_1.t.actions.openClaude}</button>}
              {quest.state === 'queued' && <button type="button" class="btn" onClick={function () { return onOpen(quest.id); }}>{en_1.t.nav.quests}</button>}
            </div>
          </article></li>;
                })}</ul>
        {!graph.tasks.some(function (q) { return filter === 'all' || q.state === filter; }) && <p>{en_1.t.branches.noMatch}</p>}
      </>}
    </>; }}</read_view_1.ReadView>
    {isFreeing && <free_space_1.FreeSpace engine={engine} realm={view.key} onClose={function () { setFreeing(false); read.refresh(); }}/>}
    {selected && <branch_review_1.BranchReview key={selected} engine={engine} realm={view.key} id={selected} onClose={function () { setSelected(null); read.refresh(); }}/>}
  </main>;
};
exports.BranchesPage = BranchesPage;
