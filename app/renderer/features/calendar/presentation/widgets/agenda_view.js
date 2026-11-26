"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaView = void 0;
var en_1 = require("../../../../l10n/en");
var calendar_days_1 = require("../../domain/calendar_days");
var calendar_items_1 = require("../../domain/calendar_items");
var calendar_item_1 = require("./calendar_item");
var Line = function (_a) {
    var item = _a.item, day = _a.day, here = _a.here, actions = _a.actions;
    return (<li class="cal-line">
    <span class="cal-when">{item.kind === 'due' ? en_1.t.calendar.states[item.state] : (0, calendar_item_1.whenText)(item, here)}</span>
    <calendar_item_1.ItemChip item={item} day={day} here={here} actions={actions}/>
    {item.kind === 'event' && item.event.place !== null && <span class="sub">{item.event.place}</span>}
  </li>);
};
// Four weeks, day by day, with only the days that hold something. When the
// weeks include today, quests already past their due date come first.
var AgendaView = function (_a) {
    var anchor = _a.anchor, today = _a.today, here = _a.here, items = _a.items, actions = _a.actions;
    var last = (0, calendar_days_1.addDays)(anchor, calendar_days_1.AGENDA_DAYS - 1);
    var overdue = anchor <= today && today <= last ? items.filter(function (item) { return item.kind === 'due' && item.isOverdue && item.day < anchor; }) : [];
    var days = Array.from({ length: calendar_days_1.AGENDA_DAYS }, function (_, i) { return (0, calendar_days_1.addDays)(anchor, i); })
        .map(function (day) { return ({ day: day, on: (0, calendar_items_1.itemsOn)(items, day) }); })
        .filter(function (_a) {
        var on = _a.on;
        return on.length > 0;
    });
    if (overdue.length === 0 && days.length === 0)
        return <p class="panel panel-pad hint cal-none">{en_1.t.calendar.emptyRange}</p>;
    return (<div class="cal-agenda panel panel-pad">
      {overdue.length > 0 && (<section aria-labelledby="cal-overdue">
          <h2 id="cal-overdue" class="cal-agenda-day overdue">
            {en_1.t.calendar.overdueGroup}
          </h2>
          <ul class="cal-lines">
            {overdue.map(function (item) { return (<Line key={item.key} item={item} day={today} here={here} actions={actions}/>); })}
          </ul>
        </section>)}
      {days.map(function (_a) {
            var day = _a.day, on = _a.on;
            return (<section key={day} aria-labelledby={"cal-".concat(day)}>
          <h2 id={"cal-".concat(day)} class={"cal-agenda-day".concat(day === today ? ' today' : '')}>
            {en_1.t.calendar.dayName(day)}
            {day === today && <span class="sub"> · {en_1.t.calendar.today}</span>}
          </h2>
          <ul class="cal-lines">
            {on.map(function (item) { return (<Line key={item.key} item={item} day={day} here={here} actions={actions}/>); })}
          </ul>
        </section>);
        })}
    </div>);
};
exports.AgendaView = AgendaView;
