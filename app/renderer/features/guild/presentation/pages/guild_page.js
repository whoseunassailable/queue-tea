"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildPage = void 0;
var icon_png_1 = require("../../../../../../.claude-plugin/icon.png");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var helpers_1 = require("../../domain/helpers");
var helper_jobs_1 = require("../state_management/helper_jobs");
var helper_card_1 = require("../widgets/helper_card");
// The helpers, each ready for an order in the realm picked in the sidebar.
var GuildPage = function (_a) {
    var engine = _a.engine, realm = _a.realm, onCopy = _a.onCopy;
    var _b = (0, helper_jobs_1.useHelperJobs)(engine), read = _b.read, jobOf = _b.jobOf, send = _b.send, retry = _b.retry, stop = _b.stop;
    return (<main class="page">
      <section class="guild-h panel panel-pad" aria-labelledby="guild-h">
        <img src={icon_png_1.default} alt={en_1.t.guild.cup} width={84} height={84}/>
        <div>
          <h1 id="guild-h">{en_1.t.guild.title}</h1>
          <p>{en_1.t.guild.line}</p>
          <p>{en_1.t.guild.where}</p>
          <p>{realm === null ? en_1.t.guild.pickRealm : en_1.t.guild.worksIn(realm.name)}</p>
        </div>
      </section>
      {read.load.status === 'failed' && <states_1.Failed message={read.load.message} onRetry={read.retry}/>}
      <div class="party">
        {helpers_1.HELPERS.map(function (helper) { return (<helper_card_1.HelperCard key={helper.id} helper={helper} job={jobOf(helper.id)} isChecking={read.load.status === 'loading'} realm={realm} onSend={function (key, order) { return send(key, helper.id, order); }} onStop={function () { return stop(helper.id); }} onRetry={retry} onCopy={onCopy}/>); })}
      </div>
    </main>);
};
exports.GuildPage = GuildPage;
