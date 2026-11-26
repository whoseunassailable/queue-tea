"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionMenu = exports.VersionRail = void 0;
var hooks_1 = require("preact/hooks");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var en_1 = require("../../../../l10n/en");
var badgeOf = function (row) {
    if (row.problem !== null)
        return { text: en_1.t.designs.couldntRead, tone: 'bad' };
    if (row.approved !== null)
        return { text: en_1.t.designs.approvedTag, tone: 'done' };
    if (row.open > 0)
        return { text: en_1.t.designs.open(row.open), tone: 'open' };
    if (row.sent > 0 && row.sentTo !== null)
        return { text: en_1.t.designs.sent(row.sent, row.sentTo), tone: 'sent' };
    return row.resolved > 0 ? { text: en_1.t.designs.allResolved, tone: 'done' } : null;
};
var Badge = function (_a) {
    var row = _a.row;
    var badge = badgeOf(row);
    return badge === null ? null : <span class={"dz-badge ".concat(badge.tone)}>{badge.text}</span>;
};
var Row = function (_a) {
    var row = _a.row, isCurrent = _a.isCurrent, onPick = _a.onPick;
    return (<li>
    <button type="button" class={"dz-vrow".concat(isCurrent ? ' sel' : '')} aria-current={isCurrent ? 'true' : undefined} onClick={onPick}>
      <span class="dz-vlabel">{row.label}</span>
      <span class="sub">{row.problem === null ? en_1.t.designs.rowMeta(row.made, row.designCount) : row.problem.file}</span>
      <Badge row={row}/>
    </button>
  </li>);
};
var VersionRail = function (_a) {
    var view = _a.view, current = _a.current, showFailure = _a.showFailure, onPick = _a.onPick, onShow = _a.onShow;
    return (<aside class="dz-rail panel" aria-labelledby="dz-history">
    <div class="sec-row">
      <h2 id="dz-history">{en_1.t.designs.history}</h2>
      <span class="sub">{en_1.t.designs.versions(view.versions.length, view.coming.length)}</span>
    </div>
    {view.versions.length === 0 && view.coming.length === 0 && <p class="hint">{en_1.t.designs.railEmpty}</p>}
    <ul class="dz-vlist">
      {view.coming.map(function (next) { return (<li key={next.label} class="dz-vrow coming">
          <span class="dz-vlabel">{next.label}</span>
          <span class="sub">{en_1.t.designs.comingLine}</span>
          <span class="dz-badge sent">{en_1.t.designs.comingFrom(next.from)}</span>
        </li>); })}
      {view.versions.map(function (row) { return (<Row key={row.folder} row={row} isCurrent={row.folder === current} onPick={function () { return onPick(row.folder); }}/>); })}
    </ul>
    <div class="dz-rail-foot">
      <span class="sub">{en_1.t.designs.savedIn}</span>
      <code>docs/designs/</code>
      <button type="button" class="link-btn" onClick={onShow}>
        {en_1.t.designs.showInFinder}
      </button>
      {showFailure !== null && (<p class="field-error" role="alert">
          {showFailure}
        </p>)}
    </div>
  </aside>);
};
exports.VersionRail = VersionRail;
// A narrow window's history: one button naming the version, opening a list
// that ↑↓ move through, ↩ opens and Esc closes.
var VersionMenu = function (_a) {
    var view = _a.view, current = _a.current, showFailure = _a.showFailure, onPick = _a.onPick, onShow = _a.onShow;
    var _b = (0, hooks_1.useState)(false), isOpen = _b[0], setOpen = _b[1];
    var at = Math.max(0, view.versions.findIndex(function (row) { return row.folder === current; }));
    var _c = (0, hooks_1.useState)(at), focus = _c[0], setFocus = _c[1];
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (!isOpen)
            return;
        if (event.key === 'Escape')
            setOpen(false);
        else if (event.key === 'ArrowDown')
            setFocus(function (i) { return Math.min(view.versions.length - 1, i + 1); });
        else if (event.key === 'ArrowUp')
            setFocus(function (i) { return Math.max(0, i - 1); });
        else if (event.key === 'Enter' && view.versions[focus] !== undefined) {
            onPick(view.versions[focus].folder);
            setOpen(false);
        }
        else
            return;
        event.preventDefault();
        event.stopPropagation();
    });
    return (<div class="dz-vmenu">
      <button type="button" class="btn" aria-expanded={isOpen} onClick={function () {
            setFocus(at);
            setOpen(!isOpen);
        }}>
        {en_1.t.designs.versionMenu(at + 1, view.versions.length)} ▾
      </button>
      {isOpen && (<div class="dz-vmenu-list panel" role="listbox" aria-label={en_1.t.designs.historyMenu}>
          <p class="sub">{en_1.t.designs.historyMenu}</p>
          {view.coming.map(function (next) { return (<div key={next.label} role="option" aria-disabled="true" aria-selected={false} class="dz-vrow coming">
              <span class="dz-vlabel">{next.label}</span>
              <span class="sub">{en_1.t.designs.comingLine}</span>
              <span class="dz-badge sent">{en_1.t.designs.comingFrom(next.from)}</span>
            </div>); })}
          {view.versions.map(function (row, i) { return (<button key={row.folder} type="button" role="option" aria-selected={i === focus} class={"dz-vrow".concat(i === focus ? ' sel' : '')} onClick={function () {
                    onPick(row.folder);
                    setOpen(false);
                }}>
              <span class="dz-vlabel">{row.label}</span>
              <span class="sub">{en_1.t.designs.rowMeta(row.made, row.designCount)}</span>
              <Badge row={row}/>
            </button>); })}
          <p class="sub">{en_1.t.designs.menuKeys}</p>
        </div>)}
      <button type="button" class="link-btn" onClick={onShow}>
        {en_1.t.designs.showInFinder}
      </button>
      {showFailure !== null && (<p class="field-error" role="alert">
          {showFailure}
        </p>)}
    </div>);
};
exports.VersionMenu = VersionMenu;
