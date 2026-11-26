"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hud = void 0;
var routes_1 = require("../../../../config/routing/routes");
var format_1 = require("../../../../core/domain/format");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var momentum_1 = require("../../domain/momentum");
var FLAME = 'M8 14.5c-3 0-4.5-2-4.5-4.3C3.5 7 6.5 6 6.5 2.5c2 1.2 3 3 2.8 4.6.8-.4 1.3-1.1 1.4-2 1.5 1.3 1.8 3 1.8 4.5 0 2.7-1.6 4.9-4.5 4.9z';
var COIN = 'M8 5v6M6.3 6.5h2.6a1.2 1.2 0 0 1 0 2.4H7.1a1.2 1.2 0 0 0 0 2.4h2.6';
var CRYSTAL = 'M8 1.5 12.5 6 8 14.5 3.5 6zM3.5 6h9M8 1.5 6.5 6 8 14.5 9.5 6z';
var percent = function (share) { return "".concat(share * 100, "%"); };
// The road to the next level: how far you've come, the stretch the quest ahead
// would add, and a pearl at the front of it.
var Road = function (_a) {
    var momentum = _a.momentum, label = _a.label;
    return (<span class="bar xp road" role="img" aria-label={label}>
    <span class="fill" style={{ transform: "scaleX(".concat(momentum.share, ")") }}/>
    {momentum.gain > 0 && <span class="gain" style={{ left: percent(momentum.share), width: percent(momentum.gain) }}/>}
    <span class="pearl" style={{ transform: "translateX(".concat(percent(momentum.share), ")") }}/>
  </span>);
};
var Level = function (_a) {
    var game = _a.game, quest = _a.quest;
    var momentum = (0, momentum_1.momentumOf)(game, quest);
    return (<a class={momentum.isClose ? 'hud-chip panel lvl close' : 'hud-chip panel lvl'} href={(0, routes_1.hrefOf)(routes_1.ROUTES.hoard)} aria-label={en_1.t.hud.levelLink(game.level, momentum.headline, momentum.hook)}>
      <span class="lvl-badge">{en_1.t.hud.level(game.level)}</span>
      <span class="road-stack">
        <span class="road-head">
          <b>{momentum.headline}</b>
        </span>
        <Road momentum={momentum} label={en_1.t.hud.xp(game.xpIntoLevel, game.xpToNextLevel, game.level + 1)}/>
        <span class="hud-sub road-hook">{momentum.hook}</span>
      </span>
    </a>);
};
var Streak = function (_a) {
    var game = _a.game;
    return (<a class={(0, momentum_1.isStreakAtRisk)(game) ? 'hud-chip panel risk' : 'hud-chip panel'} href={(0, routes_1.hrefOf)(routes_1.ROUTES.chronicle)} aria-label={en_1.t.hud.streakLink(game.streak, game.bestStreak)}>
    <svg class="ico flame" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
      <path d={FLAME}/>
    </svg>
    <span class="hud-stack">
      <b>{en_1.t.hud.streak(game.streak)}</b>
      <span class="hud-sub">{en_1.t.hud.best(game.bestStreak)}</span>
    </span>
  </a>);
};
var Gold = function (_a) {
    var game = _a.game;
    return (<a class="hud-chip panel" href={(0, routes_1.hrefOf)(routes_1.ROUTES.hoard)} aria-label={en_1.t.hud.goldLink(game.gold)}>
    <svg class="ico coin" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6"/>
      <path d={COIN}/>
    </svg>
    <span class="hud-stack">
      <b>{game.gold}</b>
      <span class="hud-sub">{en_1.t.hud.gold}</span>
    </span>
  </a>);
};
// Only once it's known. A pill with nothing to say just looks like a button.
var Mana = function (_a) {
    var game = _a.game;
    if (game.allowance === null)
        return null;
    var left = (0, format_1.manaLeft)(game.allowance);
    return (<div class="hud-chip panel mana">
      <svg class="ico crystal" width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
        <path d={CRYSTAL}/>
      </svg>
      <span class="hud-stack">
        <span class="bar mp" role="img" aria-label={en_1.t.hud.manaLabel(left)}>
          <span class="fill" style={{ transform: "scaleX(".concat(left / 100, ")") }}/>
        </span>
        <span class="hud-sub">{en_1.t.hud.mana(left, (0, format_1.refillTime)(game.allowance))}</span>
      </span>
    </div>);
};
var Hud = function (_a) {
    var game = _a.game, quest = _a.quest, onRetry = _a.onRetry, children = _a.children;
    if (game.status === 'loading') {
        return (<div class="hud" role="status">
        <div class="hud-chip panel">
          <states_1.Spinner />
          <span class="hud-sub">{en_1.t.loading.game}</span>
        </div>
      </div>);
    }
    if (game.status === 'failed') {
        return (<div class="hud" role="alert">
        <div class="hud-chip panel">
          <span class="hud-sub">{game.message}</span>
          <button type="button" class="link-btn" onClick={onRetry}>
            {en_1.t.failed.tryAgain}
          </button>
        </div>
      </div>);
    }
    return (<div class="hud">
      <Level game={game.data} quest={quest}/>
      <Streak game={game.data}/>
      <Gold game={game.data}/>
      <Mana game={game.data}/>
      {children}
    </div>);
};
exports.Hud = Hud;
