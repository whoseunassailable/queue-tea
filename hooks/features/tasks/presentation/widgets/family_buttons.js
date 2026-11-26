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
exports.familyButtons = familyButtons;
var keys_1 = require("../../../../core/widgets/keys");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var queue_controller_1 = require("../state_management/queue_controller");
// Part of… for a task with none under it; Active feature for one on its own.
function familyButtons(c, task) {
    var p = c.p, Button = c.Button, tasks = c.tasks, feature = c.feature;
    return __spreadArray(__spreadArray([], ((0, families_1.childrenOf)(task, tasks).length === 0
        ? [<Button key={"part-of:".concat(task.id)} plain hotkey={keys_1.KEYS.partOf} label="Part of…" onPress={function () { return void (0, queue_controller_1.pressPartOf)(p, task.id); }}/>]
        : []), true), ((0, families_1.parentOf)(task, tasks) === null
        ? [
            <Button key={"feature:".concat(task.id)} plain hotkey={keys_1.KEYS.feature} label={(feature === null || feature === void 0 ? void 0 : feature.id) === task.id ? 'Active feature •' : 'Active feature'} onPress={function () { return void (0, queue_controller_1.pressFeature)(p, task.id); }}/>,
        ]
        : []), true);
}
