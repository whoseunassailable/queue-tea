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
exports.HoardPage = void 0;
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var format_1 = require("../../../../core/domain/format");
var art_1 = require("../../../../core/widgets/art");
var medals_1 = require("../../../../core/widgets/art/medals");
var read_view_1 = require("../../../../core/widgets/read_view");
var en_1 = require("../../../../l10n/en");
var stages_1 = require("../../domain/stages");
var Hoard = function (_a) {
    var view = _a.view;
    var game = view.game, realms = view.realms;
    var most = Math.max.apply(Math, __spreadArray([1], realms.map(function (r) { return r.gold; }), false));
    return (<section class="panel panel-pad" aria-labelledby="gold-h">
      <div class="sec-row">
        <h2 id="gold-h">{en_1.t.hoard.title}</h2>
      </div>
      <art_1.Coins />
      <p class="gold-big">
        {game.gold} <span>{en_1.t.hoard.gold(game.victories)}</span>
      </p>
      {realms.map(function (realm) { return (<div key={realm.key} class="bar-row">
          <span>{en_1.t.hoard.realm(realm.name, realm.victories)}</span>
          <span class="num">{en_1.t.hoard.goldCount(realm.gold)}</span>
          <span class="track">
            <span style={{ width: "".concat((realm.gold / most) * 100, "%") }}/>
          </span>
        </div>); })}
      <p class="card-note">{game.victories === 0 ? en_1.t.hoard.noneYet : en_1.t.hoard.note}</p>
    </section>);
};
var stageLine = function (stage, state) {
    if (state === 'done')
        return "".concat(en_1.t.hoard.levels[stage], " \u00B7 ").concat(en_1.t.hoard.hatched);
    if (state === 'now')
        return "".concat(en_1.t.hoard.levels[stage], " \u00B7 ").concat(en_1.t.hoard.here);
    return "".concat(en_1.t.hoard.levels[stage], " \u00B7 ").concat(en_1.t.hoard.atXp((0, stages_1.stageXp)(stage).toLocaleString('en-US')));
};
var YourDragon = function (_a) {
    var game = _a.game;
    return (<section class="panel panel-pad" aria-labelledby="dragon-h">
    <div class="sec-row">
      <h2 id="dragon-h">{en_1.t.hoard.dragon}</h2>
      <span class="sec-sub">{en_1.t.hoard.dragonSub(game.level, game.xp)}</span>
    </div>
    <ol class="stages">
      {stages_1.STAGES.map(function (stage) {
            var state = (0, stages_1.stageState)(stage, game.stage);
            return (<li key={stage} class={"stage-i ".concat(state)}>
            <span class="art">{stage === 'egg' ? <art_1.EggArt /> : <art_1.StageArt stage={stage}/>}</span>
            <b>{en_1.t.hoard.stages[stage]}</b>
            <i>{stageLine(stage, state)}</i>
          </li>);
        })}
    </ol>
    <div class="bar-row">
      <span>{en_1.t.hoard.toLevel(game.level + 1)}</span>
      <span class="num">{en_1.t.hoard.xpBar(game.xpIntoLevel, game.xpToNextLevel)}</span>
      <span class="track">
        <span style={{ width: "".concat((game.xpIntoLevel / game.xpToNextLevel) * 100, "%") }}/>
      </span>
    </div>
    <p class="card-note">{en_1.t.hoard.rules}</p>
  </section>);
};
var BadgeItem = function (_a) {
    var badge = _a.badge;
    var percent = Math.round((badge.have / badge.need) * 100);
    var line = en_1.t.hoard.badgeLine[badge.id](badge.have, badge.need);
    return (<li class={badge.earnedOn === null ? 'bdg' : 'bdg got'}>
      <span class="medal" aria-hidden="true" dangerouslySetInnerHTML={{ __html: medals_1.MEDALS[badge.id] }}/>
      <span>
        <b>{en_1.t.badges[badge.id]}</b>
        <i>{badge.earnedOn === null ? line : "".concat(line, " \u00B7 ").concat((0, format_1.dayOf)(badge.earnedOn))}</i>
        {badge.earnedOn === null && (<span class="track" role="img" aria-label={en_1.t.hoard.wayAlong(percent)}>
            <span style={{ width: "".concat(percent, "%") }}/>
          </span>)}
      </span>
    </li>);
};
var HoardPage = function (_a) {
    var engine = _a.engine;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readHoard(); }, []);
    return (<main class="page">
      <read_view_1.ReadView read={read} line={en_1.t.loading.hoard}>
        {function (view) { return (<>
            {view.unreadable > 0 && <p class="hint">{en_1.t.chronicle.leftOut(view.unreadable)}</p>}
            <div class="hoard-grid">
              <Hoard view={view}/>
              <YourDragon game={view.game}/>
            </div>
            <section class="panel panel-pad" aria-labelledby="badges-h">
              <div class="sec-row">
                <h2 id="badges-h">{en_1.t.hoard.badges}</h2>
                <span class="sec-sub">{en_1.t.hoard.earned(view.game.badges.filter(function (b) { return b.earnedOn !== null; }).length, view.game.badges.length)}</span>
              </div>
              <ul class="badge-grid">
                {view.game.badges.map(function (badge) { return (<BadgeItem key={badge.id} badge={badge}/>); })}
              </ul>
            </section>
          </>); }}
      </read_view_1.ReadView>
    </main>);
};
exports.HoardPage = HoardPage;
