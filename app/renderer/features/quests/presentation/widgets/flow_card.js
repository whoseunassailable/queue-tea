"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowCard = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../../../../core/constants/constants");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var copy_line_1 = require("./copy_line");
var Talisman = function () { return (<svg class="talisman" viewBox="0 0 44 80" width="44" height="80" aria-hidden="true">
    <rect x="4" y="2" width="36" height="76" rx="3" fill="#F6E3B0" stroke="#A87C30" stroke-width="2"/>
    <rect x="9" y="7" width="26" height="66" fill="none" stroke="#B23C2B" stroke-width="2"/>
    <path d="M22 14v14M15 21h14M16 36l12 8M28 36l-12 8M22 50v14M16 57h12" fill="none" stroke="#B23C2B" stroke-width="2.4" stroke-linecap="round"/>
  </svg>); };
var Files = function (_a) {
    var hold = _a.hold;
    var _b = (0, hooks_1.useState)(false), isOpen = _b[0], setOpen = _b[1];
    if (hold.files.length === 0)
        return null;
    var shown = isOpen ? hold.files : hold.files.slice(0, constants_1.HOLD_FILES_SHOWN);
    var hidden = hold.fileCount - shown.length;
    return (<div class="files" aria-label={en_1.t.flow.notCommitted}>
      {shown.map(function (file) { return (<span key={file}>{file}</span>); })}
      {hidden > 0 &&
            (isOpen ? (<span>{en_1.t.flow.more(hidden)}</span>) : (<button type="button" class="link-btn" onClick={function () { return setOpen(true); }}>
            {en_1.t.flow.more(hidden)}
          </button>))}
    </div>);
};
var Held = function (_a) {
    var flow = _a.flow, actions = _a.actions;
    var hold = flow.hold;
    return (<section class="mcard panel" aria-label={en_1.t.flow.gate(flow.title)}>
      <div class="m-h">
        <Talisman />
        <div>
          <p>{en_1.t.flow.gate(flow.title)}</p>
          <p class="card-note">{hold.branch === null ? hold.reason : en_1.t.flow.holdOn(hold.reason, hold.branch, hold.head)}</p>
        </div>
      </div>
      <Files hold={hold}/>
      <p class="card-note">{"".concat(en_1.t.flow.advice[hold.kind], " ").concat(en_1.t.flow.nothingChanged)}</p>
      {hold.command !== null && <copy_line_1.CopyLine text={hold.command} onCopy={actions.onCopy}/>}
      <div class="row-end">
        <button type="button" class="btn" onClick={actions.onCancel}>
          {en_1.t.actions.cancel}
        </button>
        <button type="button" class="btn primary" disabled={flow.isChecking} onClick={actions.onCheckAgain}>
          {flow.isChecking && <states_1.Spinner />}
          {flow.isChecking ? en_1.t.flow.checking : en_1.t.flow.checkAgain}
        </button>
      </div>
    </section>);
};
// What a quest is in the middle of, in place of the active card.
var FlowCard = function (_a) {
    var flow = _a.flow, actions = _a.actions;
    if (flow.kind === 'held')
        return <Held flow={flow} actions={actions}/>;
    if (flow.kind === 'working') {
        return (<section class="mcard panel" role="status" aria-label={en_1.t.flow.working}>
        <p class="m-title">{flow.title}</p>
        <ul class="steps">
          <li>
            <span class="st wait">
              <states_1.Spinner />
            </span>
            {flow.line}
          </li>
        </ul>
      </section>);
    }
    if (flow.kind === 'refused') {
        return (<section class="mcard panel" role="alert">
        <p class="m-title">{flow.title}</p>
        <p class="card-note">{flow.message}</p>
        <div class="row-end">
          <button type="button" class="btn" onClick={actions.onCancel}>
            {en_1.t.actions.cancel}
          </button>
          <button type="button" class="btn primary" onClick={actions.onCheckAgain}>
            {en_1.t.failed.tryAgain}
          </button>
        </div>
      </section>);
    }
    return (<section class="mcard panel" aria-label={en_1.t.flow.couldntOpen(en_1.t.terminal[flow.terminal])}>
      <p class="m-title">{en_1.t.flow.couldntOpen(en_1.t.terminal[flow.terminal])}</p>
      <p class="card-note">{en_1.t.flow.pasteLine}</p>
      <copy_line_1.CopyLine text={flow.command} onCopy={actions.onCopy}/>
      <div class="row-end">
        <button type="button" class="btn" onClick={actions.onCancel}>
          {en_1.t.actions.ok}
        </button>
        <button type="button" class="btn primary" onClick={actions.onCheckAgain}>
          {en_1.t.failed.tryAgain}
        </button>
      </div>
    </section>);
};
exports.FlowCard = FlowCard;
