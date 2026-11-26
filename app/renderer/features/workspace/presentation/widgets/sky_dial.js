"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkyDial = void 0;
var en_1 = require("../../../../l10n/en");
var CHOICES = [
    { choice: 'auto', mark: '◷' },
    { choice: 'morning', mark: '❀' },
    { choice: 'day', mark: '☀' },
    { choice: 'evening', mark: '◐' },
    { choice: 'night', mark: '☾' },
];
var SkyDial = function (_a) {
    var sky = _a.sky, onPick = _a.onPick;
    return (<div class="dial panel" role="group" aria-label={en_1.t.sky.label}>
    {CHOICES.map(function (_a) {
            var choice = _a.choice, mark = _a.mark;
            return (<button key={choice} type="button" class={choice === sky ? 'dial-btn on' : 'dial-btn'} aria-pressed={choice === sky ? 'true' : 'false'} aria-label={en_1.t.sky.choices[choice]} onClick={function () { return onPick(choice); }}>
        {mark}
      </button>);
        })}
    <span class="dial-note">{sky === 'auto' ? en_1.t.sky.follows : en_1.t.sky.fixed(sky)}</span>
  </div>);
};
exports.SkyDial = SkyDial;
