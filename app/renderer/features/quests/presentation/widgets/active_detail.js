"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveDetail = void 0;
var hooks_1 = require("preact/hooks");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var format_1 = require("../../../../core/domain/format");
var en_1 = require("../../../../l10n/en");
var states_1 = require("../../../../core/widgets/states");
var due_control_1 = require("./due_control");
var helper_toggles_1 = require("./helper_toggles");
var priority_control_1 = require("./priority_control");
var quest_notes_1 = require("./quest_notes");
var test_profile_control_1 = require("./test_profile_control");
// Testing time is the checks' own run; building time is the clock's minutes
// outside them. Codex's checks aren't timed, so the row waits for Claude Code.
var Facts = function (_a) {
    var _b;
    var facts = _a.facts, active = _a.active;
    return (<dl class="facts">
    <dt>{en_1.t.notes.timeLabel}</dt>
    <dd>{en_1.t.notes.time((0, format_1.formatMinutes)(facts.minutes), facts.started === null ? null : (0, format_1.dayAndTime)(facts.started), (0, format_1.formatMinutes)(facts.today))}</dd>
    {active.codexSince === null && (<>
        <dt>{en_1.t.notes.testingLabel}</dt>
        <dd>{active.testingMinutes === 0 ? en_1.t.notes.noChecks : en_1.t.notes.testing((0, format_1.formatMinutes)(active.testingMinutes), (0, format_1.formatMinutes)(Math.max(0, facts.minutes - active.minutesInChecks)))}</dd>
      </>)}
    <dt>{en_1.t.notes.effortLabel}</dt>
    <dd>{en_1.t.notes.effort(facts.improvingMessages, facts.understandingMessages)}</dd>
    <dt>{en_1.t.notes.filesLabel}</dt>
    <dd>{en_1.t.notes.files(facts.filesRead, facts.filesChanged)}</dd>
    {facts.lines !== null && (<>
        <dt>{en_1.t.notes.linesLabel}</dt>
        <dd>{en_1.t.notes.lines(facts.lines.added, facts.lines.removed, facts.lines.since)}</dd>
      </>)}
    {facts.git !== null && (<>
        <dt>{en_1.t.notes.gitLabel}</dt>
        <dd class="mono">{(_b = facts.git.head) !== null && _b !== void 0 ? _b : facts.git.branch}</dd>
      </>)}
  </dl>);
};
var NotCommitted = function (_a) {
    var git = _a.git;
    if (git.uncommittedCount === 0)
        return null;
    var hidden = git.uncommittedCount - git.uncommitted.length;
    return (<details class="notes">
      <summary>{en_1.t.notes.uncommitted(git.uncommittedCount)}</summary>
      <div class="files">
        {git.uncommitted.map(function (file) { return (<span key={file}>{file}</span>); })}
        {hidden > 0 && <span>{en_1.t.flow.more(hidden)}</span>}
      </div>
    </details>);
};
// The quest in hand, in full. Its actions stay on the card beside it.
var ActiveDetail = function (_a) {
    var _b;
    var engine = _a.engine, realm = _a.realm, active = _a.active, isSaved = _a.isSaved, edits = _a.edits;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readQuestFacts(realm, active.id); }, [realm, active.id]);
    // Codex events arrive outside the record watcher; keep that feed live.
    (0, hooks_1.useEffect)(function () {
        var timer = setInterval(read.refresh, active.codexSince ? constants_1.ACTIVITY_REFRESH_MS : constants_1.LINES_REFRESH_MS);
        return function () { return clearInterval(timer); };
    }, [read.refresh, active.codexSince]);
    var facts = read.load.status === 'ready' ? read.load.data : null;
    return (<aside class="detail panel" aria-label={en_1.t.detail.label}>
      <p class="d-kind">{active.isBoss ? en_1.t.quest.boss : en_1.t.quest.active}</p>
      <h2 class="d-title">{active.title}</h2>
      <div class="d-chips">
        <priority_control_1.PriorityControl title={active.title} priority={active.priority} isSaved={isSaved} onPick={function (priority) { return void edits.setPriority(realm, active, priority); }}/>
        <span class="d-est">{en_1.t.difficulty[active.difficulty]}</span>
      </div>
      <h3>{en_1.t.helpers.label}</h3>
      <helper_toggles_1.HelperToggles on={active.helpers} onChange={function (helpers) { return edits.edit(realm, active, { helpers: helpers }); }}/>
      <h3>{en_1.t.testProfile.label}</h3>
      <test_profile_control_1.TestProfileControl profile={active.testProfile} onChange={function (testProfile) { return edits.edit(realm, active, { testProfile: testProfile }); }}/>
      <due_control_1.DueControl key={active.id} due={active.due} onChange={function (due) { return edits.edit(realm, active, { due: due }); }}/>
      <hr />
      {read.load.status === 'loading' && <p class="hint" role="status"><states_1.Spinner />{en_1.t.loading.stillReading}</p>}
      {read.load.status === 'failed' && <p class="hint" role="alert">{read.load.message}</p>}
      {read.load.status === 'ready' && read.note !== null && <p class="hint" role="alert">{read.note}</p>}
      <button type="button" class="link-btn" disabled={read.isRefreshing || read.load.status === 'loading'} onClick={read.load.status === 'failed' ? read.retry : read.refresh}>
        {read.isRefreshing && <states_1.Spinner />}{read.isRefreshing ? en_1.t.activity.refreshing : en_1.t.activity.refresh}
      </button>
      {(facts === null || facts === void 0 ? void 0 : facts.active) != null && <Facts facts={facts.active} active={active}/>}
      {((_b = facts === null || facts === void 0 ? void 0 : facts.active) === null || _b === void 0 ? void 0 : _b.git) != null && <NotCommitted git={facts.active.git}/>}
      {facts !== null && <quest_notes_1.QuestNotes facts={facts}/>}
    </aside>);
};
exports.ActiveDetail = ActiveDetail;
