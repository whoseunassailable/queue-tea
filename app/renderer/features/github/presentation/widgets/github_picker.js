"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInPanel = exports.GithubPicker = exports.GithubState = exports.detailOf = void 0;
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var copy_line_1 = require("../../../quests/presentation/widgets/copy_line");
var choice_1 = require("../../domain/choice");
var INSTALL = 'brew install gh';
var RADIOS = 'github-account';
var detailOf = function (account) {
    if (!account.isWorking)
        return en_1.t.github.lapsed;
    return account.isActive ? en_1.t.github.active : null;
};
exports.detailOf = detailOf;
// The code to give GitHub, and the wait while you do.
var SignInPanel = function (_a) {
    var github = _a.github, canCancel = _a.canCancel;
    var signIn = github.signIn;
    if (signIn.status === 'starting') {
        return (<p class="form-line gh-wait" role="status">
        <states_1.Spinner />
        {en_1.t.github.starting}
      </p>);
    }
    if (signIn.status === 'code') {
        return (<div class="gh-code-box">
        <p class="form-line">{en_1.t.github.signInAs}</p>
        <code class="gh-code">{signIn.code}</code>
        <button type="button" class="btn primary" onClick={function () { return github.openGithub(signIn.code); }}>
          {en_1.t.github.openIt}
        </button>
        {signIn.note !== null && (<p class="form-banner" role="alert">
            {signIn.note}
          </p>)}
        <p class="form-line gh-wait" role="status">
          <states_1.Spinner />
          {en_1.t.github.waiting}
        </p>
        {canCancel && (<button type="button" class="link-btn" onClick={github.cancel}>
            {en_1.t.actions.cancel}
          </button>)}
      </div>);
    }
    return (<>
      {signIn.status === 'failed' && (<p class="form-banner" role="alert">
          {signIn.message}
        </p>)}
      {signIn.status === 'same' && <p class="form-line">{en_1.t.github.sameAccount}</p>}
      <button type="button" class="btn gh-add" onClick={github.add}>
        {en_1.t.github.add}
      </button>
    </>);
};
exports.SignInPanel = SignInPanel;
// Where gh stands: still being asked, couldn't be asked, or not installed.
// Anything else is a list of accounts, for `children` to show.
var GithubState = function (_a) {
    var github = _a.github, onCopy = _a.onCopy, children = _a.children;
    var accounts = github.accounts;
    if (accounts.status === 'loading') {
        return (<p class="form-line gh-wait" role="status">
        <states_1.Spinner />
        {en_1.t.loading.github}
      </p>);
    }
    if (accounts.status === 'failed') {
        return (<div class="form-banner" role="alert">
        <p>{accounts.message}</p>
        <button type="button" class="link-btn" onClick={github.read}>
          {en_1.t.failed.tryAgain}
        </button>
      </div>);
    }
    if (accounts.data.kind === 'missing') {
        return (<div class="gh-missing">
        <p class="form-line">{en_1.t.github.missing}</p>
        <copy_line_1.CopyLine text={INSTALL} onCopy={onCopy}/>
        <button type="button" class="link-btn" onClick={github.read}>
          {en_1.t.failed.tryAgain}
        </button>
      </div>);
    }
    return <>{children(accounts.data.accounts)}</>;
};
exports.GithubState = GithubState;
// Pick an account, or none, or add one. The same in every place that asks.
var GithubPicker = function (_a) {
    var github = _a.github, picked = _a.picked, error = _a.error, onPick = _a.onPick, onCopy = _a.onCopy;
    return (<exports.GithubState github={github} onCopy={onCopy}>
    {function (accounts) { return (<>
        {accounts.length === 0 ? (<p class="form-line">{en_1.t.github.noAccounts}</p>) : (<field_1.Group label={en_1.t.github.question} error={error}>
            {accounts.map(function (account) { return (<field_1.Pick key={account.login} name={RADIOS} label={account.login} detail={(0, exports.detailOf)(account)} isPicked={picked === account.login} onPick={function () { return onPick(account.login); }}/>); })}
            <field_1.Pick name={RADIOS} label={en_1.t.github.none} isPicked={picked === choice_1.NO_ACCOUNT} onPick={function () { return onPick(choice_1.NO_ACCOUNT); }}/>
          </field_1.Group>)}
        <SignInPanel github={github} canCancel={false}/>
      </>); }}
  </exports.GithubState>);
};
exports.GithubPicker = GithubPicker;
