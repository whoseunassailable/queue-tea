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
exports.ManaPage = void 0;
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var format_1 = require("../../../../core/domain/format");
var read_view_1 = require("../../../../core/widgets/read_view");
var week_chart_1 = require("../../../../core/widgets/week_chart");
var en_1 = require("../../../../l10n/en");
var ATTENTION_PERCENT = 90;
var Orb = function (_a) {
    var allowance = _a.allowance, view = _a.view;
    var left = (0, format_1.manaLeft)(allowance);
    var used = Math.round(allowance.percent);
    var rules = en_1.t.mana.rules(view.options.freshAtTokens.toLocaleString('en-US'), view.options.handoffAtPercent);
    return (<>
      <div class={used >= ATTENTION_PERCENT ? 'mana-orb low' : 'mana-orb'} role="img" aria-label={en_1.t.mana.orbLabel(left)}>
        <div class="liquid" style={{ height: "".concat(left, "%") }}>
          <svg class="wave" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10C25 0 25 20 50 10S75 0 100 10 125 20 150 10 175 0 200 10V20H0Z"/>
          </svg>
        </div>
        <div class="read">
          <b>{left}%</b>
          <span>{en_1.t.mana.left}</span>
        </div>
      </div>
      <p class="big mana-used">{allowance.isStale ? en_1.t.mana.lastSeen(used, (0, format_1.clockTime)(allowance.seenAt)) : en_1.t.mana.used(used, (0, format_1.refillTime)(allowance))}</p>
      <p class="card-note">{allowance.isStale ? rules : "".concat(en_1.t.mana.from((0, format_1.clockTime)(allowance.seenAt)), " ").concat(rules)}</p>
    </>);
};
var Tiles = function (_a) {
    var view = _a.view;
    var most = Math.max.apply(Math, __spreadArray([1, view.elsewhere], view.byQuest.map(function (row) { return row.minutes; }), false));
    var bar = function (label, minutes) { return (<div key={label} class="bar-row">
      <span>{label}</span>
      <span class="num">{(0, format_1.formatMinutes)(minutes)}</span>
      <span class="track">
        <span style={{ width: "".concat((minutes / most) * 100, "%") }}/>
      </span>
    </div>); };
    return (<div class="mana-grid">
      <section class="panel panel-pad mana-card" aria-labelledby="mana-h">
        <h2 class="sec-row" id="mana-h">
          {en_1.t.mana.orb}
        </h2>
        {view.allowance === null ? (<>
            <p class="big mana-used">{en_1.t.mana.unknown}</p>
            <p class="card-note">{en_1.t.mana.unknownLine}</p>
          </>) : (<Orb allowance={view.allowance} view={view}/>)}
      </section>
      <section class="panel panel-pad" aria-labelledby="today-h">
        <h3 id="today-h">{en_1.t.mana.today("".concat((0, format_1.weekdayOf)(view.today.day), " ").concat(Number(view.today.day.slice(8, 10))))}</h3>
        <p class="big">{(0, format_1.formatMinutes)(view.today.onQuests + view.today.elsewhere)}</p>
        <dl class="kv">
          <dt>{en_1.t.mana.onQuests}</dt>
          <dd>{(0, format_1.formatMinutes)(view.today.onQuests)}</dd>
          <dt>{en_1.t.mana.elsewhere}</dt>
          <dd>{(0, format_1.formatMinutes)(view.today.elsewhere)}</dd>
        </dl>
      </section>
      <section class="panel panel-pad" aria-labelledby="week-h">
        <h3 id="week-h">{en_1.t.mana.week}</h3>
        <p class="big">{(0, format_1.formatMinutes)(view.weekMinutes)}</p>
        <p class="card-note">{en_1.t.mana.weekLine((0, format_1.formatMinutes)(view.lastWeekMinutes), view.victories, view.inProgress)}</p>
        <week_chart_1.MiniChart days={view.days}/>
        <week_chart_1.Legend />
      </section>
      {view.active !== null && (<section class="panel panel-pad" aria-labelledby="quest-h">
          <h3 id="quest-h">{view.active.isBoss ? en_1.t.mana.boss : en_1.t.mana.active}</h3>
          <p>{en_1.t.mana.questLine(view.active.title, (0, format_1.formatMinutes)(view.active.minutes))}</p>
          <dl class="kv">
            <dt>{en_1.t.mana.messages}</dt>
            <dd>{en_1.t.mana.messagesLine(view.active.understandingMessages, view.active.improvingMessages)}</dd>
            <dt>{en_1.t.mana.files}</dt>
            <dd>{en_1.t.mana.filesLine(view.active.filesRead, view.active.filesChanged)}</dd>
            {view.lines !== null && (<>
                <dt>{en_1.t.mana.lines}</dt>
                <dd>{en_1.t.mana.linesLine(view.lines.added, view.lines.removed, view.lines.since)}</dd>
              </>)}
          </dl>
        </section>)}
      <section class="panel panel-pad" aria-labelledby="by-h">
        <h3 id="by-h">{en_1.t.mana.byQuest}</h3>
        {view.byQuest.length === 0 && view.elsewhere === 0 && <p class="hint">{en_1.t.mana.nothing}</p>}
        {view.byQuest.map(function (row) { return bar(row.title, row.minutes); })}
        {view.elsewhere > 0 && bar(en_1.t.mana.elsewhereRow, view.elsewhere)}
      </section>
    </div>);
};
var ManaPage = function (_a) {
    var engine = _a.engine, realm = _a.realm;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readMana(realm); }, [realm]);
    var sub = read.load.status === 'ready' ? en_1.t.mana.sub(read.load.data.realm, read.load.data.days[0].day, read.load.data.days.at(-1).day) : null;
    return (<main class="page">
      <div class="page-h panel">
        <h1>{en_1.t.mana.title}</h1>
        {sub !== null && <span class="sec-sub">{sub}</span>}
      </div>
      <read_view_1.ReadView read={read} line={en_1.t.loading.mana}>
        {function (view) { return <Tiles view={view}/>; }}
      </read_view_1.ReadView>
    </main>);
};
exports.ManaPage = ManaPage;
