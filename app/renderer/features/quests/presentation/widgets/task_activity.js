"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskActivity = void 0;
var format_1 = require("../../../../core/domain/format");
var step_line_1 = require("../../../../core/widgets/step_line");
var en_1 = require("../../../../l10n/en");
// The step the quest is on now, then its commits, oldest first.
var TaskActivity = function (_a) {
    var activity = _a.activity;
    var commits = __spreadArray([], activity.commits, true).sort(function (a, b) { return Date.parse(a.at) - Date.parse(b.at); });
    return (<section class="task-activity" aria-label={en_1.t.activity.title}>
      <h3>{en_1.t.activity.title}</h3>
      <p class="hint">{en_1.t.activity.coverage}</p>
      {activity.gitUnavailable && <p role="alert" class="hint">{en_1.t.activity.gitUnavailable}</p>}
      {activity.step === null ? <p class="card-note">{en_1.t.activity.empty}</p> : <step_line_1.StepLine step={activity.step}/>}
      {commits.length > 0 && (<ol class="activity-list">
          {commits.map(function (commit) { return (<li key={commit.id}>
              <time dateTime={commit.at}>{(0, format_1.dayAndTime)(commit.at)}:{commit.at.slice(17, 19)}</time>
              <strong>{en_1.t.activity.committed}</strong>
              <p class="activity-subject">{commit.message}</p>
              <code>{commit.id.slice(0, 7)}</code>
              <p class="hint">{commit.remotes === null ? en_1.t.activity.unknownRemote : commit.remotes.length === 0 ? en_1.t.activity.noRemote : en_1.t.activity.remote(commit.remotes)}</p>
            </li>); })}
        </ol>)}
      {commits.length > 0 && <p class="hint">{en_1.t.activity.retained}</p>}
      {commits.length > 0 && <p class="hint">{en_1.t.activity.remoteHint}</p>}
    </section>);
};
exports.TaskActivity = TaskActivity;
