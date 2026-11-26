"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemChip = exports.whenText = void 0;
var en_1 = require("../../../../l10n/en");
var timeOf = function (wall) { return wall.slice(11, 16); };
// When a timed event happens on the Mac's clock, and on its own when that's another zone's.
var whenText = function (item, here) {
    var when = item.event.when;
    if (when.kind === 'allDay' || item.start === null || item.end === null)
        return item.firstDay === item.lastDay ? en_1.t.calendar.allDay : "".concat(en_1.t.calendar.allDay, " \u00B7 ").concat(en_1.t.calendar.days(item.firstDay, item.lastDay));
    var end = item.end.slice(0, 10) === item.start.slice(0, 10) ? timeOf(item.end) : en_1.t.calendar.endsOn(timeOf(item.end), item.end.slice(0, 10));
    var own = when.zone === here ? '' : " \u00B7 ".concat(en_1.t.calendar.inZone(timeOf(when.start), timeOf(when.end), when.zone));
    return "".concat(en_1.t.calendar.span(timeOf(item.start), end)).concat(own);
};
exports.whenText = whenText;
// One item as a small button: an event opens its sheet, a due date its quest.
var ItemChip = function (_a) {
    var item = _a.item, day = _a.day, here = _a.here, actions = _a.actions;
    if (item.kind === 'due') {
        return (<button type="button" class={"cal-chip due ".concat(item.state).concat(item.isOverdue ? ' overdue' : '')} aria-label={en_1.t.calendar.openQuest(item.title, item.isOverdue ? en_1.t.calendar.overdue : en_1.t.calendar.states[item.state])} onClick={function () { return actions.onOpenQuest(item.questId); }}>
        <span class="cal-tag">{item.isOverdue ? en_1.t.calendar.overdue : en_1.t.calendar.due}</span>
        <span class="cal-name">{item.title}</span>
      </button>);
    }
    // A timed event shows its start on its first day only.
    var start = item.start !== null && item.start.slice(0, 10) === day ? timeOf(item.start) : null;
    return (<button type="button" class={"cal-chip event".concat(item.start === null ? ' all-day' : '')} title={"".concat(item.event.title, " \u00B7 ").concat((0, exports.whenText)(item, here))} aria-label={en_1.t.calendar.editEvent(item.event.title)} onClick={function () { return actions.onEdit(item.event); }}>
      {start !== null && <span class="cal-time">{start}</span>}
      <span class="cal-name">{item.event.title}</span>
    </button>);
};
exports.ItemChip = ItemChip;
