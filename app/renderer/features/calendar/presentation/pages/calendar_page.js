"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarPage = void 0;
var hooks_1 = require("preact/hooks");
var calendar_time_1 = require("../../../../../shared/calendar_time");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var dialog_1 = require("../../../../core/widgets/dialog");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var calendar_days_1 = require("../../domain/calendar_days");
var calendar_items_1 = require("../../domain/calendar_items");
var event_form_1 = require("../../domain/event_form");
var agenda_view_1 = require("../widgets/agenda_view");
var event_sheet_1 = require("../widgets/event_sheet");
var month_view_1 = require("../widgets/month_view");
var week_view_1 = require("../widgets/week_view");
require("../calendar.css");
var RemoveEvent = function (_a) {
    var event = _a.event, onRemove = _a.onRemove, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(null), failure = _b[0], setFailure = _b[1];
    var isSending = (0, hooks_1.useRef)(false);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, onRemove(event)];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.calendar.removeTitle(event.title)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{en_1.t.calendar.removeLine}</p>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.calendar.removeIt}
        </button>
      </div>
    </dialog_1.Dialog>);
};
var titleOf = function (mode, anchor) {
    if (mode === 'month')
        return en_1.t.calendar.monthTitle(anchor);
    var _a = (0, calendar_days_1.rangeOf)(mode, anchor), first = _a.first, last = _a.last;
    return en_1.t.calendar.rangeTitle(first, last);
};
// A realm's calendar: its events, and the due dates of its quests in play.
// Times show on the Mac's clock; an event keeps the zone it was made in.
var CalendarPage = function (_a) {
    var _b, _c;
    var engine = _a.engine, realm = _a.realm, onOpenQuest = _a.onOpenQuest, onSay = _a.onSay, _d = _a.nowMs, nowMs = _d === void 0 ? Date.now : _d, _e = _a.zone, zone = _e === void 0 ? calendar_time_1.hereZone : _e;
    var here = (0, hooks_1.useMemo)(zone, [zone]);
    var _f = (0, hooks_1.useState)(nowMs), now = _f[0], setNow = _f[1];
    (0, hooks_1.useEffect)(function () {
        var timer = setInterval(function () { return setNow(nowMs()); }, constants_1.CALENDAR_CLOCK_MS);
        return function () { return clearInterval(timer); };
    }, [nowMs]);
    var today = (0, calendar_days_1.todayIn)(here, now);
    var _g = (0, hooks_1.useState)('month'), mode = _g[0], setMode = _g[1];
    var _h = (0, hooks_1.useState)(today), anchor = _h[0], setAnchor = _h[1];
    var _j = (0, hooks_1.useState)(null), sheet = _j[0], setSheet = _j[1];
    var _k = (0, hooks_1.useState)(null), removing = _k[0], setRemoving = _k[1];
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readCalendar(realm.key); }, [realm.key]);
    var events = read.load.status === 'ready' ? read.load.data.events : [];
    var items = (0, hooks_1.useMemo)(function () { return (0, calendar_items_1.itemsOf)(events, realm, here, today); }, [events, realm, here, today]);
    var change = function (call, said) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    if (answer.ok) {
                        read.adopt(answer.data);
                        onSay(said);
                    }
                    return [2 /*return*/, answer];
            }
        });
    }); };
    var save = function (input) { return change(function () { var _a, _b; return engine.saveCalendarEvent(realm.key, (_b = (_a = sheet === null || sheet === void 0 ? void 0 : sheet.event) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null, input); }, en_1.t.calendar.saved(input.title)); };
    var remove = function (event) { return change(function () { return engine.removeCalendarEvent(realm.key, event.id); }, en_1.t.calendar.removed(event.title)); };
    var add = function (day) { return setSheet({ event: null, start: (0, event_form_1.newEventForm)(day, here, now) }); };
    var actions = { onEdit: function (event) { return setSheet({ event: event, start: (0, event_form_1.formOf)(event, here) }); }, onOpenQuest: onOpenQuest };
    var _l = (0, calendar_days_1.rangeOf)(mode, anchor), first = _l.first, last = _l.last;
    // New event lands on today when the view shows it, else on the view's first day.
    var addDay = first <= today && today <= last ? today : mode === 'month' ? "".concat(anchor.slice(0, 7), "-01") : first;
    return (<main class="page cal">
      <read_view_1.ReadView read={read} line={en_1.t.loading.calendar}>
        {function (view) { return (<>
            <div class="page-h panel">
              <h1>{en_1.t.calendar.title}</h1>
              <div class="seg" role="group" aria-label={en_1.t.calendar.views}>
                {calendar_days_1.CALENDAR_MODES.map(function (each) { return (<button key={each} type="button" class={each === mode ? 'on' : undefined} aria-pressed={each === mode} onClick={function () { return setMode(each); }}>
                    {en_1.t.calendar.modes[each]}
                  </button>); })}
              </div>
              <button type="button" class="btn primary" onClick={function () { return add(addDay); }}>
                {en_1.t.calendar.newEvent}
              </button>
            </div>
            {view.unreadable > 0 && (<p class="note panel" role="status">
                {en_1.t.calendar.unreadable(view.unreadable)}
              </p>)}
            {items.length === 0 ? (<states_1.Empty title={en_1.t.calendar.emptyTitle} line={en_1.t.calendar.empty}>
                <button type="button" class="btn primary" onClick={function () { return add(today); }}>
                  {en_1.t.calendar.newEvent}
                </button>
              </states_1.Empty>) : (<>
                <div class="cal-bar">
                  <button type="button" class="icon-btn" aria-label={en_1.t.calendar.previous[mode]} onClick={function () { return setAnchor((0, calendar_days_1.stepOf)(mode, anchor, -1)); }}>
                    ‹
                  </button>
                  <button type="button" class="chip-btn" onClick={function () { return setAnchor(today); }}>
                    {en_1.t.calendar.today}
                  </button>
                  <button type="button" class="icon-btn" aria-label={en_1.t.calendar.next[mode]} onClick={function () { return setAnchor((0, calendar_days_1.stepOf)(mode, anchor, 1)); }}>
                    ›
                  </button>
                  <h2 class="cal-title" aria-live="polite">
                    {titleOf(mode, anchor)}
                  </h2>
                  <span class="hint">{en_1.t.calendar.clock(here)}</span>
                </div>
                {mode === 'month' && (<month_view_1.MonthView anchor={anchor} today={today} here={here} items={items} actions={actions} onAdd={add} onMore={function (day) {
                        setMode('agenda');
                        setAnchor(day);
                    }}/>)}
                {mode === 'week' && <week_view_1.WeekView anchor={anchor} today={today} now={(0, calendar_time_1.wallOf)(now, here)} here={here} items={items} actions={actions} onAdd={add}/>}
                {mode === 'agenda' && <agenda_view_1.AgendaView anchor={anchor} today={today} here={here} items={items} actions={actions}/>}
              </>)}
          </>); }}
      </read_view_1.ReadView>
      {sheet !== null && (<event_sheet_1.EventSheet 
        // A new sheet for each event, so one's draft never shows in another.
        key={(_c = (_b = sheet.event) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 'new'} event={sheet.event} start={sheet.start} here={here} onSave={save} onRemove={function (event) {
                setSheet(null);
                setRemoving(event);
            }} onClose={function () { return setSheet(null); }}/>)}
      {removing !== null && <RemoveEvent event={removing} onRemove={remove} onClose={function () { return setRemoving(null); }}/>}
    </main>);
};
exports.CalendarPage = CalendarPage;
