"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepLine = void 0;
var format_1 = require("../domain/format");
var en_1 = require("../../l10n/en");
// The step a task is on now, or, between steps, the last one and how it ended.
// One line: no command output is kept.
var StepLine = function (_a) {
    var _b;
    var step = _a.step;
    var isRunning = step.status === 'running';
    return (<p class="step-line" aria-label={en_1.t.activity.stepLabel}>
      <strong>{isRunning ? en_1.t.activity.now : en_1.t.activity.last}</strong>
      <span>{isRunning ? en_1.t.activity.doing[step.kind] : en_1.t.activity.done[step.kind]}</span>
      <code class="activity-subject">{step.subject}</code>
      {!isRunning && <span class={"activity-status ".concat(step.status)}>{en_1.t.activity.status[step.status]}</span>}
      <time class="hint" dateTime={step.at}>{isRunning ? en_1.t.activity.since((0, format_1.dayAndTime)(step.at)) : (0, format_1.dayAndTime)((_b = step.finished) !== null && _b !== void 0 ? _b : step.at)}</time>
    </p>);
};
exports.StepLine = StepLine;
