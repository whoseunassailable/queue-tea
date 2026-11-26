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
exports.WeekView = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../../../../core/constants/constants");
var en_1 = require("../../../../l10n/en");
var calendar_days_1 = require("../../domain/calendar_days");
var calendar_items_1 = require("../../domain/calendar_items");
var calendar_item_1 = require("./calendar_item");
var HOURS = Array.from({ length: 24 }, function (_, hour) { return hour; });
var px = function (minutes) { return (minutes / 60) * constants_1.CALENDAR_HOUR_PX; };
// Seven days of hours. All-day events and due dates sit in a row above; timed
// events sit at their hours on the Mac's clock, side by side where they overlap.
var WeekView = function (_a) {
    var anchor = _a.anchor, today = _a.today, now = _a.now, here = _a.here, items = _a.items, actions = _a.actions, onAdd = _a.onAdd;
    var scroller = (0, hooks_1.useRef)(null);
    (0, hooks_1.useLayoutEffect)(function () {
        if (scroller.current !== null)
            scroller.current.scrollTop = constants_1.CALENDAR_OPEN_HOUR * constants_1.CALENDAR_HOUR_PX;
    }, []);
    var days = (0, calendar_days_1.weekOf)(anchor);
    var nowMinutes = Number(now.slice(11, 13)) * 60 + Number(now.slice(14, 16));
    return (<div class="cal-week panel">
      <div class="cal-week-head">
        <span class="cal-gutter"/>
        {days.map(function (day) { return (<button key={day} type="button" class={"cal-week-day".concat(day === today ? ' today' : '')} aria-current={day === today ? 'date' : undefined} aria-label={en_1.t.calendar.addOn(day)} onClick={function () { return onAdd(day); }}>
            {en_1.t.calendar.dayName(day)}
          </button>); })}
      </div>
      <div class="cal-week-all" role="group" aria-label={en_1.t.calendar.allDayRow}>
        <span class="cal-gutter">{en_1.t.calendar.allDay}</span>
        {days.map(function (day) { return (<div key={day} class="cal-week-cell">
            {(0, calendar_items_1.itemsOn)(items, day)
                .filter(function (item) { return !(0, calendar_items_1.isTimed)(item); })
                .map(function (item) { return (<calendar_item_1.ItemChip key={item.key} item={item} day={day} here={here} actions={actions}/>); })}
          </div>); })}
      </div>
      <div class="cal-week-scroll" ref={scroller}>
        <div class="cal-week-grid" style={{ height: "".concat(px(24 * 60), "px") }}>
          <div class="cal-gutter cal-hours">
            {HOURS.map(function (hour) { return (<span key={hour} class="cal-hour" style={{ top: "".concat(px(hour * 60), "px") }}>
                {hour === 0 ? '' : "".concat(String(hour).padStart(2, '0'), ":00")}
              </span>); })}
          </div>
          {days.map(function (day) {
            var placed = (0, calendar_items_1.lanesOf)((0, calendar_items_1.itemsOn)(items, day)
                .filter(calendar_items_1.isTimed)
                .map(function (item) { return (__assign({ item: item }, (0, calendar_items_1.minutesOn)(item, day))); }));
            return (<div key={day} class={"cal-week-col".concat(day === today ? ' today' : '')} role="group" aria-label={en_1.t.calendar.dayName(day)}>
                {placed.map(function (_a) {
                    var item = _a.item, from = _a.from, to = _a.to, lane = _a.lane, lanes = _a.lanes;
                    return (<div key={item.key} class="cal-block" style={{ top: "".concat(px(from), "px"), height: "".concat(px(to - from), "px"), left: "".concat((lane / lanes) * 100, "%"), width: "".concat(100 / lanes, "%") }}>
                    <calendar_item_1.ItemChip item={item} day={day} here={here} actions={actions}/>
                  </div>);
                })}
                {day === today && <span class="cal-now" style={{ top: "".concat(px(nowMinutes), "px") }} title={en_1.t.calendar.now} aria-hidden="true"/>}
              </div>);
        })}
        </div>
      </div>
    </div>);
};
exports.WeekView = WeekView;
