"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDialog = void 0;
var hooks_1 = require("preact/hooks");
var dialog_1 = require("../../../../core/widgets/dialog");
var en_1 = require("../../../../l10n/en");
var choice_1 = require("../../domain/choice");
var use_github_1 = require("../state_management/use_github");
var github_picker_1 = require("./github_picker");
// Which account a realm belongs to, kept with the app's settings.
var ConnectDialog = function (_a) {
    var engine = _a.engine, realm = _a.realm, connected = _a.connected, onSave = _a.onSave, onCopy = _a.onCopy, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(connected), choice = _b[0], setChoice = _b[1];
    var _c = (0, hooks_1.useState)(false), isTouched = _c[0], setTouched = _c[1];
    var github = (0, use_github_1.useGithub)(engine, setChoice);
    var picked = (0, choice_1.pickedOf)(github.accounts, choice);
    var submit = function () {
        setTouched(true);
        if ((0, choice_1.needsAnswer)(github.accounts, picked) || github.isSigningIn)
            return;
        if ((0, choice_1.hasAccounts)(github.accounts))
            onSave(picked === choice_1.NO_ACCOUNT ? null : picked);
        onClose();
    };
    return (<dialog_1.Dialog title={en_1.t.github.title(realm)} onCancel={onClose} onSubmit={submit}>
      <p class="form-line">{en_1.t.github.line}</p>
      {connected !== null && (0, choice_1.isGone)(github.accounts, connected) && <p class="form-banner">{en_1.t.github.gone(connected)}</p>}
      <github_picker_1.GithubPicker github={github} picked={picked} error={isTouched && (0, choice_1.needsAnswer)(github.accounts, picked) ? en_1.t.github.pickOne : undefined} onPick={setChoice} onCopy={onCopy}/>
      <p class="card-note">{en_1.t.github.note}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        {(0, choice_1.hasAccounts)(github.accounts) && (<button type="submit" class="btn primary">
            {en_1.t.actions.save}
          </button>)}
      </div>
    </dialog_1.Dialog>);
};
exports.ConnectDialog = ConnectDialog;
