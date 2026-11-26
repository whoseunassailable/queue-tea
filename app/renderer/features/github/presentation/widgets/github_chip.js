"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubChip = void 0;
var en_1 = require("../../../../l10n/en");
var MARK = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z';
// The realm's GitHub account in the HUD, or the way to connect one.
var GithubChip = function (_a) {
    var login = _a.login, onOpen = _a.onOpen;
    return (<button type="button" class={login === null ? 'hud-chip panel gh-chip connect' : 'hud-chip panel gh-chip'} aria-label={login === null ? en_1.t.github.connect : en_1.t.github.connected(login)} onClick={onOpen}>
    <svg class="ico gh-mark" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
      <path d={MARK}/>
    </svg>
    {login === null ? (<b>{en_1.t.github.connect}</b>) : (<span class="hud-stack">
        <b>{en_1.t.github.chip(login)}</b>
        <span class="hud-sub">{en_1.t.github.chipSub}</span>
      </span>)}
  </button>);
};
exports.GithubChip = GithubChip;
