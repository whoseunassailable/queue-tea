"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubAccounts = void 0;
var en_1 = require("../../../../l10n/en");
var use_github_1 = require("../state_management/use_github");
var github_picker_1 = require("./github_picker");
// The accounts on this Mac, for Settings. Which realm uses which is the realm's
// own business, and shows with the realm.
var GithubAccounts = function (_a) {
    var engine = _a.engine, onCopy = _a.onCopy;
    var github = (0, use_github_1.useGithub)(engine);
    return (<section class="panel panel-pad" aria-labelledby="set-github">
      <div class="sec-row">
        <h2 id="set-github">{en_1.t.github.accounts}</h2>
        <span class="sec-sub">{en_1.t.github.accountsSub}</span>
      </div>
      <github_picker_1.GithubState github={github} onCopy={onCopy}>
        {function (accounts) { return (<>
            {accounts.length === 0 && <p class="form-line">{en_1.t.github.noAccountsHere}</p>}
            {accounts.map(function (account) { return (<div key={account.login} class="set-row">
                <span class="mono">{account.login}</span>
                {(0, github_picker_1.detailOf)(account) !== null && <span class="val">{(0, github_picker_1.detailOf)(account)}</span>}
              </div>); })}
            <github_picker_1.SignInPanel github={github} canCancel/>
          </>); }}
      </github_picker_1.GithubState>
    </section>);
};
exports.GithubAccounts = GithubAccounts;
