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
exports.MiniChart = exports.WeekChart = exports.Legend = void 0;
var format_1 = require("../domain/format");
var en_1 = require("../../l10n/en");
var BAR_PX = { full: 140, mini: 90 };
var dayTotal = function (day) { return day.onQuests + day.elsewhere; };
var Column = function (_a) {
    var day = _a.day, most = _a.most, size = _a.size;
    var height = function (minutes) { return "".concat((minutes / most) * BAR_PX[size], "px"); };
    return (<span class="col">
      {day.elsewhere > 0 && <span class="seg-out" style={{ height: height(day.elsewhere) }}/>}
      {day.onQuests > 0 && <span class="seg-in" style={{ height: height(day.onQuests) }}/>}
    </span>);
};
var totalText = function (day) { return (dayTotal(day) === 0 ? '—' : (0, format_1.formatMinutes)(dayTotal(day))); };
// The busiest day is full height. An empty week has nothing to measure against,
// and its bars simply aren't drawn.
var mostOf = function (days) { return Math.max.apply(Math, __spreadArray([1], days.map(dayTotal), false)); };
var Legend = function () { return (<div class="legend">
    <span>
      <i class="in"/>
      {en_1.t.chronicle.onQuests}
    </span>
    <span>
      <i class="out"/>
      {en_1.t.chronicle.elsewhere}
    </span>
  </div>); };
exports.Legend = Legend;
var WeekChart = function (_a) {
    var days = _a.days, picked = _a.picked, label = _a.label, onPick = _a.onPick;
    var most = mostOf(days);
    return (<div class="chart" role="group" aria-label={label}>
      {days.map(function (day) { return (<button key={day.day} type="button" class={day.day === picked ? 'day sel' : 'day'} aria-label={"".concat((0, format_1.dayName)(day.day), ": ").concat(totalText(day))} aria-pressed={day.day === picked} onClick={function () { return onPick(day.day); }}>
          <Column day={day} most={most} size="full"/>
          <span class="day-lbl">{(0, format_1.dayName)(day.day)}</span>
          <span class="day-total">{totalText(day)}</span>
        </button>); })}
    </div>);
};
exports.WeekChart = WeekChart;
var MiniChart = function (_a) {
    var days = _a.days;
    var most = mostOf(days);
    return (<div class="mini-chart">
      {days.map(function (day) { return (<div key={day.day} class="day">
          <Column day={day} most={most} size="mini"/>
          <span class="day-lbl">{(0, format_1.weekdayOf)(day.day)}</span>
          <span class="day-total">{totalText(day)}</span>
        </div>); })}
    </div>);
};
exports.MiniChart = MiniChart;
