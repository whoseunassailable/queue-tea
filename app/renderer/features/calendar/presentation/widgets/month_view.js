"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthView = void 0;
var constants_1 = require("../../../../core/constants/constants");
var en_1 = require("../../../../l10n/en");
var calendar_days_1 = require("../../domain/calendar_days");
var calendar_items_1 = require("../../domain/calendar_items");
var calendar_item_1 = require("./calendar_item");
// The month's weeks, Monday first. A day shows its first few items; the rest
// wait in the agenda, one press away.
var MonthView = function (_a) {
    var anchor = _a.anchor, today = _a.today, here = _a.here, items = _a.items, actions = _a.actions, onAdd = _a.onAdd, onMore = _a.onMore;
    var month = anchor.slice(0, 7);
    return (<div class="cal-month panel" role="grid" aria-label={en_1.t.calendar.monthTitle(anchor)}>
      <div class="cal-row cal-head" role="row">
        {en_1.t.calendar.weekdays.map(function (name) { return (<span key={name} class="cal-weekday" role="columnheader">
            {name}
          </span>); })}
      </div>
      {(0, calendar_days_1.monthWeeksOf)(anchor).map(function (week) { return (<div key={week[0]} class="cal-row" role="row">
          {week.map(function (day) {
                var on = (0, calendar_items_1.itemsOn)(items, day);
                var shown = on.length > constants_1.CALENDAR_MONTH_ITEMS ? on.slice(0, constants_1.CALENDAR_MONTH_ITEMS - 1) : on;
                var hidden = on.length - shown.length;
                return (<div key={day} role="gridcell" class={"cal-day".concat(day.slice(0, 7) === month ? '' : ' out').concat(day === today ? ' today' : '')} aria-current={day === today ? 'date' : undefined}>
                <button type="button" class="cal-date" aria-label={en_1.t.calendar.addOn(day)} onClick={function () { return onAdd(day); }}>
                  {Number(day.slice(8, 10))}
                </button>
                {shown.map(function (item) { return (<calendar_item_1.ItemChip key={item.key} item={item} day={day} here={here} actions={actions}/>); })}
                {hidden > 0 && (<button type="button" class="cal-more" aria-label={en_1.t.calendar.moreOn(hidden, day)} onClick={function () { return onMore(day); }}>
                    {en_1.t.calendar.more(hidden)}
                  </button>)}
              </div>);
            })}
        </div>); })}
    </div>);
};
exports.MonthView = MonthView;
