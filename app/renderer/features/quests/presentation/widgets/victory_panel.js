"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryPanel = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../../../../core/constants/constants");
var en_1 = require("../../../../l10n/en");
var tags_1 = require("../../../../core/widgets/tags");
// Where each coin lands, and when it sets off.
var COINS = [
    { dx: -220, dy: -160, delay: 0 },
    { dx: -140, dy: -230, delay: 0.05 },
    { dx: -40, dy: -260, delay: 0.1 },
    { dx: 60, dy: -250, delay: 0.02 },
    { dx: 160, dy: -210, delay: 0.12 },
    { dx: 230, dy: -140, delay: 0.07 },
    { dx: -260, dy: -60, delay: 0.15 },
    { dx: 270, dy: -50, delay: 0.18 },
];
// Shown once the win is saved, so it can't hold anything up. It takes no keys
// of its own: the board's keep working behind it, and the window handles Esc.
var VictoryPanel = function (_a) {
    var won = _a.won, isCalm = _a.isCalm, onClose = _a.onClose;
    var victory = won.victory, logPath = won.logPath;
    var close = (0, hooks_1.useRef)(null);
    (0, hooks_1.useLayoutEffect)(function () { var _a; return (_a = close.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
    var finished = en_1.t.win.finishedAs(en_1.t.difficulty[victory.actual], en_1.t.difficulty[victory.expected]);
    var growsAt = constants_1.GROWS_AT[victory.stage];
    return (<div class="win-layer" onClick={function (event) {
            if (event.target === event.currentTarget)
                onClose();
        }}>
      {!isCalm && (<div class="coins" aria-hidden="true">
          {COINS.map(function (coin) { return (<span key={coin.dx} class="cn" style={{ '--dx': "".concat(coin.dx, "px"), '--dy': "".concat(coin.dy, "px"), animationDelay: "".concat(coin.delay, "s") }}/>); })}
        </div>)}
      <div class="victory panel" role="dialog" aria-labelledby="w-title">
        <p class="win-kicker">{en_1.t.win.kicker[victory.kind]}</p>
        <h2 class="win-title" id="w-title">
          {en_1.t.win.title}
        </h2>
        <p class="win-quest">{victory.title}</p>
        <div class="win-rows">
          {victory.didLevelUp && (<p>
              <span class="reward xp">{en_1.t.win.level(victory.level)}</span>
              <span>{en_1.t.win.nextLevel(victory.nextLevelAt)}</span>
            </p>)}
          <p>
            <tags_1.XpReward xp={victory.xp}/>
            <span>{en_1.t.win.toLevel(victory.xpIntoLevel, victory.xpToNextLevel, victory.level + 1)}</span>
          </p>
          <p>
            <tags_1.GoldReward gold={victory.gold}/>
            <span>{en_1.t.win.hoard(victory.hoard)}</span>
          </p>
          {victory.newBadges.map(function (badge) { return (<p key={badge}>
              <span class="reward badge-r">{en_1.t.badges[badge]}</span>
              <span>{en_1.t.win.badgeEarned}</span>
            </p>); })}
        </div>
        <p class="win-note">{logPath === null ? finished : "".concat(finished, " \u00B7 ").concat(en_1.t.win.rowWent(logPath))}</p>
        {victory.didLevelUp && growsAt !== null && <p class="win-note">{en_1.t.win.grows(en_1.t.stage[victory.stage], growsAt)}</p>}
        <button ref={close} type="button" class="btn primary" onClick={onClose}>
          {en_1.t.win.close}
        </button>
      </div>
    </div>);
};
exports.VictoryPanel = VictoryPanel;
