"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChroniclePage = void 0;
var hooks_1 = require("preact/hooks");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var format_1 = require("../../../../core/domain/format");
var read_view_1 = require("../../../../core/widgets/read_view");
var tags_1 = require("../../../../core/widgets/tags");
var week_chart_1 = require("../../../../core/widgets/week_chart");
var en_1 = require("../../../../l10n/en");
var DAY_MS = 86400000;
var WEEK_DAYS = 7;
var SHORT_COMMIT = 7;
var shiftDays = function (day, days) { return new Date(Date.parse("".concat(day, "T00:00:00Z")) + days * DAY_MS).toISOString().slice(0, 10); };
var RANK = { light: 0, medium: 1, hard: 2 };
var movedClass = function (line) {
    var moved = RANK[line.actual] - RANK[line.expected];
    if (moved === 0)
        return '';
    return moved > 0 ? 'harder' : 'easier';
};
var Summary = function (_a) {
    var view = _a.view;
    return (<p class="summary">
    <b>{en_1.t.chronicle.summary(view.victories.length, (0, format_1.formatMinutes)(view.minutes))}</b>
    {" \u00B7 ".concat(en_1.t.chronicle.split((0, format_1.formatMinutes)(view.onQuests), (0, format_1.formatMinutes)(view.elsewhere)), " \u00B7 ").concat(en_1.t.chronicle.moved(view.asExpected, view.harder, view.easier), " \u00B7 ")}
    <b>{en_1.t.quest.xp(view.xp)}</b>
  </p>);
};
var DayLine = function (_a) {
    var view = _a.view, picked = _a.picked;
    var day = view.days.find(function (d) { return d.day === picked; });
    if (day === undefined)
        return <p class="day-line">{en_1.t.chronicle.pickDay}</p>;
    var total = day.onQuests + day.elsewhere;
    var name = (0, format_1.dayName)(day.day);
    return <p class="day-line">{total === 0 ? en_1.t.chronicle.dayEmpty(name) : en_1.t.chronicle.dayLine(name, (0, format_1.formatMinutes)(total), (0, format_1.formatMinutes)(day.onQuests), (0, format_1.formatMinutes)(day.elsewhere))}</p>;
};
var Row = function (_a) {
    var line = _a.line, showRealm = _a.showRealm, isOpen = _a.isOpen, onOpen = _a.onOpen;
    return (<tr class={isOpen ? 'tbl-open' : undefined}>
    <td class="t">
      <button type="button" class="title-btn" aria-label={en_1.t.chronicle.open(line.title)} aria-expanded={isOpen} onClick={onOpen}>
        {line.title}
      </button>
    </td>
    <td>
      <tags_1.PriorityTag priority={line.priority}/>
    </td>
    {showRealm && <td>{line.realm}</td>}
    <td class="num">{(0, format_1.dayName)(line.finished.slice(0, 10))}</td>
    <td class="num">{(0, format_1.formatMinutes)(line.minutes)}</td>
    <td>
      {"".concat(en_1.t.difficulty[line.expected], " \u2192 ")}
      <span class={movedClass(line)}>{en_1.t.difficulty[line.actual]}</span>
    </td>
    <td>
      <tags_1.XpReward xp={line.xp}/>
    </td>
  </tr>);
};
var Detail = function (_a) {
    var line = _a.line, canFollowUp = _a.canFollowUp, onFollowUp = _a.onFollowUp;
    return (<section class="panel panel-pad" aria-label={line.title}>
    <div class="sec-row">
      <h2>{line.title}</h2>
    </div>
    <dl class="kv">
      <dt>{en_1.t.chronicle.detail.time}</dt>
      <dd>{en_1.t.chronicle.span((0, format_1.formatMinutes)(line.minutes), line.started === null ? null : (0, format_1.dayAndTime)(line.started), (0, format_1.dayAndTime)(line.finished))}</dd>
      <dt>{en_1.t.chronicle.detail.effort}</dt>
      <dd>{en_1.t.chronicle.effort(line.improvingMessages)}</dd>
      <dt>{en_1.t.chronicle.detail.files}</dt>
      <dd>{en_1.t.chronicle.files(line.filesRead, line.filesChanged)}</dd>
      <dt>{en_1.t.chronicle.detail.lines}</dt>
      <dd>{en_1.t.chronicle.lines(line.linesAdded, line.linesRemoved, line.filesTouched)}</dd>
      {line.branch !== null && (<>
          <dt>{en_1.t.chronicle.detail.branch}</dt>
          <dd class="mono">{line.branch}</dd>
        </>)}
      {line.startCommit !== null && (<>
          <dt>{en_1.t.chronicle.detail.from}</dt>
          <dd class="mono">{line.startCommit.slice(0, SHORT_COMMIT)}</dd>
        </>)}
    </dl>
    {canFollowUp && (<div class="row-end">
        <span class="card-note grow">{en_1.t.chronicle.followUpNote}</span>
        <button type="button" class="btn" onClick={function () { return onFollowUp(en_1.t.chronicle.followUpTitle(line.title)); }}>
          {en_1.t.chronicle.followUp}
        </button>
      </div>)}
  </section>);
};
var Wins = function (_a) {
    var view = _a.view, path = _a.path, showRealm = _a.showRealm, onLastWeek = _a.onLastWeek, onFollowUp = _a.onFollowUp;
    var _b = (0, hooks_1.useState)(null), openId = _b[0], setOpen = _b[1];
    var open = view.victories.find(function (v) { return v.id === openId; });
    if (!view.hasAny)
        return <p class="hint">{en_1.t.chronicle.none}</p>;
    if (view.victories.length === 0) {
        return (<>
        <p class="hint">{view.isThisWeek ? en_1.t.chronicle.noneThisWeek : en_1.t.chronicle.noneThatWeek}</p>
        {view.isThisWeek && view.lastWeek.victories > 0 && (<button type="button" class="link-btn" onClick={onLastWeek}>
            {en_1.t.chronicle.lastWeek(view.lastWeek.victories, (0, format_1.formatMinutes)(view.lastWeek.minutes))}
          </button>)}
      </>);
    }
    var columns = en_1.t.chronicle.columns;
    return (<>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th>{columns.quest}</th>
              <th>{columns.priority}</th>
              {showRealm && <th>{columns.realm}</th>}
              <th>{columns.wonOn}</th>
              <th>{columns.time}</th>
              <th>{columns.moved}</th>
              <th>{columns.xp}</th>
            </tr>
          </thead>
          <tbody>
            {view.victories.map(function (line) { return (<Row key={line.id} line={line} showRealm={showRealm} isOpen={line.id === openId} onOpen={function () { return setOpen(line.id === openId ? null : line.id); }}/>); })}
          </tbody>
        </table>
      </div>
      {open !== undefined && <Detail line={open} canFollowUp={open.realmPath === path} onFollowUp={onFollowUp}/>}
    </>);
};
var ChroniclePage = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, realm = _a.realm, path = _a.path, scope = _a.scope, onScope = _a.onScope, onFollowUp = _a.onFollowUp;
    var _e = (0, hooks_1.useState)(null), week = _e[0], setWeek = _e[1];
    var _f = (0, hooks_1.useState)(null), picked = _f[0], setPicked = _f[1];
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readChronicle(scope === 'all' ? null : realm, week); }, [realm, scope, week]);
    var first = read.load.status === 'ready' ? ((_c = (_b = read.load.data.days[0]) === null || _b === void 0 ? void 0 : _b.day) !== null && _c !== void 0 ? _c : null) : null;
    var go = function (step) {
        if (first === null)
            return;
        setWeek(shiftDays(first, step * WEEK_DAYS));
        setPicked(null);
    };
    var last = read.load.status === 'ready' ? (_d = read.load.data.days.at(-1)) === null || _d === void 0 ? void 0 : _d.day : undefined;
    var isThisWeek = read.load.status !== 'ready' || read.load.data.isThisWeek;
    return (<main class="page chron">
      <div class="page-h panel">
        <h1>{en_1.t.chronicle.title}</h1>
        <div class="week-nav">
          <button type="button" class="icon-btn" aria-label={en_1.t.chronicle.earlier} onClick={function () { return go(-1); }}>
            ‹
          </button>
          {first !== null && last !== undefined && <span>{en_1.t.weekRange(first, last)}</span>}
          <button type="button" class="icon-btn" aria-label={en_1.t.chronicle.later} disabled={isThisWeek} onClick={function () { return go(1); }}>
            ›
          </button>
        </div>
        <div class="seg" role="group" aria-label={en_1.t.chronicle.which}>
          <button type="button" class={scope === 'realm' ? 'on' : ''} aria-pressed={scope === 'realm'} onClick={function () { return onScope('realm'); }}>
            {en_1.t.chronicle.thisRealm}
          </button>
          <button type="button" class={scope === 'all' ? 'on' : ''} aria-pressed={scope === 'all'} onClick={function () { return onScope('all'); }}>
            {en_1.t.chronicle.allRealms}
          </button>
        </div>
      </div>
      <read_view_1.ReadView read={read} line={en_1.t.loading.chronicle}>
        {function (view) { return (<>
            {view.unreadable > 0 && <p class="hint">{en_1.t.chronicle.leftOut(view.unreadable)}</p>}
            <section class="panel panel-pad" aria-label={en_1.t.chronicle.title}>
              <Summary view={view}/>
              <week_chart_1.WeekChart days={view.days} picked={picked} label={en_1.t.chronicle.chart((0, format_1.dayOf)(view.days[0].day), (0, format_1.dayOf)(view.days.at(-1).day))} onPick={setPicked}/>
              <week_chart_1.Legend />
              <DayLine view={view} picked={picked}/>
            </section>
            <section class="panel panel-pad" aria-labelledby="wins-h">
              <div class="sec-row">
                <h2 id="wins-h">{en_1.t.chronicle.wins}</h2>
              </div>
              <Wins view={view} path={path} showRealm={scope === 'all'} onLastWeek={function () { return go(-1); }} onFollowUp={onFollowUp}/>
            </section>
          </>); }}
      </read_view_1.ReadView>
    </main>);
};
exports.ChroniclePage = ChroniclePage;
