"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var en_1 = require("../../../l10n/en");
var task_activity_1 = require("./widgets/task_activity");
(0, vitest_1.afterEach)(preact_1.cleanup);
var running = { id: 'test', at: '2026-11-04T12:01:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' };
var activity = function (step) {
    if (step === void 0) { step = running; }
    return ({
        step: step,
        commits: [{ id: 'abc1234', at: '2026-11-04T12:03:00Z', message: 'added the activity feed', remotes: ['origin/main'] }],
        gitUnavailable: false,
    });
};
(0, vitest_1.it)('shows one line with the step the quest is on now, and its commits', function () {
    (0, preact_1.render)(<task_activity_1.TaskActivity activity={activity()}/>);
    var line = preact_1.screen.getByLabelText(en_1.t.activity.stepLabel);
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText(en_1.t.activity.now)).toBeTruthy();
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText(en_1.t.activity.doing.test)).toBeTruthy();
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText('npm test')).toBeTruthy();
    (0, vitest_1.expect)((0, preact_1.within)(line).queryByText(en_1.t.activity.status.running)).toBeNull();
    var rows = preact_1.screen.getAllByRole('listitem');
    (0, vitest_1.expect)(rows).toHaveLength(1);
    (0, vitest_1.expect)((0, preact_1.within)(rows[0]).getByText('added the activity feed')).toBeTruthy();
    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.activity.remote(['origin/main']))).toBeTruthy();
    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.activity.remoteHint)).toBeTruthy();
});
(0, vitest_1.it)('between steps, shows the last one and how it ended', function () {
    var view = (0, preact_1.render)(<task_activity_1.TaskActivity activity={activity(__assign(__assign({}, running), { status: 'failed', finished: '2026-11-04T12:02:00Z' }))}/>);
    var line = preact_1.screen.getByLabelText(en_1.t.activity.stepLabel);
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText(en_1.t.activity.last)).toBeTruthy();
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText(en_1.t.activity.done.test)).toBeTruthy();
    (0, vitest_1.expect)((0, preact_1.within)(line).getByText(en_1.t.activity.status.failed)).toBeTruthy();
    view.rerender(<task_activity_1.TaskActivity activity={activity(__assign(__assign({}, running), { id: 'edit', kind: 'edit', subject: 'a.ts', status: 'succeeded', finished: '2026-11-04T12:02:00Z' }))}/>);
    (0, vitest_1.expect)(preact_1.screen.getAllByLabelText(en_1.t.activity.stepLabel)).toHaveLength(1);
    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByLabelText(en_1.t.activity.stepLabel)).getByText('a.ts')).toBeTruthy();
});
(0, vitest_1.it)('renders a step as plain text', function () {
    (0, preact_1.render)(<task_activity_1.TaskActivity activity={activity(__assign(__assign({}, running), { subject: '<img src=x onerror="alert(1)">' }))}/>);
    (0, vitest_1.expect)(preact_1.screen.getByText('<img src=x onerror="alert(1)">').tagName).toBe('CODE');
    (0, vitest_1.expect)(document.querySelector('img')).toBeNull();
});
(0, vitest_1.it)('explains an empty quest and failed reads', function () {
    var view = (0, preact_1.render)(<task_activity_1.TaskActivity activity={{ step: null, commits: [], gitUnavailable: true }}/>);
    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.activity.empty)).toBeTruthy();
    (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toBe(en_1.t.activity.gitUnavailable);
    var data = activity();
    data.commits[0].remotes = null;
    view.rerender(<task_activity_1.TaskActivity activity={data}/>);
    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.activity.unknownRemote)).toBeTruthy();
});
