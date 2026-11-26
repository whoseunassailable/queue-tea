"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperBench = exports.helperDropped = void 0;
var helpers_1 = require("../../../../../../hooks/shared/records/domain/services/helpers");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var helpers_2 = require("../../../guild/domain/helpers");
var helper_bot_1 = require("../../../guild/presentation/widgets/helper_bot");
var constants_1 = require("../../domain/constants");
// The helper a drop carried, or null when it carried something else.
var helperDropped = function (event) {
    var _a;
    var id = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData(constants_1.HELPER_DRAG);
    return (0, helpers_1.isHelperId)(id) ? id : null;
};
exports.helperDropped = helperDropped;
var nameOf = function (id) { var _a, _b; return (_b = (_a = helpers_2.HELPERS.find(function (helper) { return helper.id === id; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : id; };
// What the helper sent to this merge is doing, then what it said.
var Report = function (_a) {
    var _b, _c;
    var job = _a.job, onStop = _a.onStop, onRetry = _a.onRetry;
    var name = nameOf(job.helper);
    if (job.status === 'working') {
        return (<div class="bench-now" role="status">
        <states_1.Spinner />
        <span>{en_1.t.branches.helperAt(name, job.doing === null ? en_1.t.guild.starting : en_1.t.guild.doing(job.doing.kind, job.doing.target))}</span>
        <button type="button" class="btn" onClick={onStop}>
          {en_1.t.guild.stop}
        </button>
      </div>);
    }
    if (job.status === 'done') {
        return (<div aria-live="polite">
        <p>
          <b>{en_1.t.branches.helperDone(name)}</b>
        </p>
        <p class="bench-reply">{((_b = job.reply) === null || _b === void 0 ? void 0 : _b.trim()) || en_1.t.guild.noReply}</p>
      </div>);
    }
    return (<div>
      <p role={job.status === 'failed' ? 'alert' : 'status'}>{job.status === 'failed' ? "".concat(en_1.t.branches.helperStuck(name), " ").concat((_c = job.error) !== null && _c !== void 0 ? _c : '') : en_1.t.branches.helperStopped(name)}</p>
      <button type="button" class="btn" onClick={onRetry}>
        {en_1.t.guild.tryAgain}
      </button>
    </div>);
};
// The four helpers beside a merge. One is dragged onto the merge, or pressed,
// to resolve its conflicts; one at a time, so two never edit the same folder.
var HelperBench = function (_a) {
    var _b, _c;
    var jobs = _a.jobs, mergeId = _a.mergeId, canSend = _a.canSend, onSend = _a.onSend, onStop = _a.onStop, onRetry = _a.onRetry;
    var here = jobs.filter(function (job) { return job.merge === mergeId; }).sort(function (a, b) { return b.started - a.started; });
    var atWork = (_b = here.find(function (job) { return job.status === 'working'; })) !== null && _b !== void 0 ? _b : null;
    var shown = (_c = atWork !== null && atWork !== void 0 ? atWork : here[0]) !== null && _c !== void 0 ? _c : null;
    return (<section class="bench" aria-label={en_1.t.branches.bench}>
      <p class="hint">{en_1.t.branches.benchHint}</p>
      <div class="bench-row">
        {helpers_2.HELPERS.map(function (helper) {
            var job = jobs.find(function (one) { return one.helper === helper.id; });
            var isElsewhere = (job === null || job === void 0 ? void 0 : job.status) === 'working' && job.merge !== mergeId;
            var isFree = canSend && atWork === null && !isElsewhere;
            return (<button key={helper.id} type="button" class={"bench-bot ".concat(helper.kind)} draggable={isFree} disabled={!isFree} aria-label={en_1.t.branches.sendHelper(helper.name)} title={isElsewhere ? en_1.t.branches.benchBusy(helper.name) : en_1.t.branches.sendHelper(helper.name)} onDragStart={function (event) {
                    var _a;
                    (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData(constants_1.HELPER_DRAG, helper.id);
                    if (event.dataTransfer)
                        event.dataTransfer.effectAllowed = 'copy';
                }} onClick={function () { return onSend(helper.id); }}>
              <helper_bot_1.HelperBot id={helper.id} mood={(job === null || job === void 0 ? void 0 : job.merge) === mergeId ? job.status : 'idle'} size={56}/>
              <span>{helper.name}</span>
            </button>);
        })}
      </div>
      {shown !== null && <Report job={shown} onStop={function () { return onStop(shown.helper); }} onRetry={function () { return onRetry(shown); }}/>}
    </section>);
};
exports.HelperBench = HelperBench;
