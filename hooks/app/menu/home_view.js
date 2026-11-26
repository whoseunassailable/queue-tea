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
exports.drawHome = drawHome;
var format_1 = require("../../core/widgets/format");
var text_1 = require("../../core/widgets/text");
var time_1 = require("../../shared/time/domain/services/time");
var week_stats_1 = require("../../shared/time/domain/services/week_stats");
var menu_controller_1 = require("./menu_controller");
var EMPTY = "Nothing queued yet. Tell me what you're working on and it becomes the first task.";
// The list, in order, each entry with its key.
var ENTRIES = [
    { view: 'brew', hotkey: '1', label: 'Brew now' },
    { view: 'backlog', hotkey: '2', label: 'Backlog' },
    { view: 'current', hotkey: '3', label: 'Current task' },
    { view: 'history', hotkey: '4', label: 'History' },
    { view: 'usage', hotkey: '5', label: 'Usage & time' },
    { view: 'settings', hotkey: '6', label: 'Settings' },
    { view: 'help', hotkey: '7', label: 'Help' },
];
var LABEL_WIDTH = 14;
function drawHome(c, cup) {
    return __awaiter(this, void 0, void 0, function () {
        var p, Box, Text, Button, cols, now, today, current, queue, blocked, waiting, feature, allowance, done, minutes, header, lines, hints, isEmpty, needsYou, todayMinutes, summary;
        var _a;
        return __generator(this, function (_b) {
            p = c.p, Box = c.Box, Text = c.Text, Button = c.Button, cols = c.cols, now = c.now, today = c.today, current = c.current, queue = c.queue, blocked = c.blocked, waiting = c.waiting, feature = c.feature, allowance = c.allowance, done = c.done, minutes = c.minutes, header = c.header, lines = c.lines, hints = c.hints;
            isEmpty = current === null && waiting === 0 && done.length === 0;
            needsYou = cup.mood === 'attention' && cup.view === 'current';
            todayMinutes = (_a = minutes[(0, week_stats_1.weekOf)(today).indexOf(today)]) !== null && _a !== void 0 ? _a : 0;
            summary = {
                brew: 'do it now, outside the queue',
                backlog: waiting === 0 ? 'nothing waiting' : "".concat(waiting, " waiting \u00B7 ").concat(queue.length === 0 ? 'all blocked' : "\u2605 ".concat(queue[0].title)),
                current: needsYou ? cup.line : current === null ? 'none' : "".concat(current.title, " \u00B7 ").concat((0, time_1.formatMinutes)((0, format_1.total)(current.minutesByDay))),
                history: "".concat(done.length, " this week \u00B7 ").concat((0, time_1.formatMinutes)((0, format_1.sum)(minutes))),
                usage: "".concat(allowance === null ? '' : "5h ".concat(Math.round(allowance.percent), "% \u00B7 "), "today ").concat((0, time_1.formatMinutes)(todayMinutes)),
                settings: '/config options and paths',
                help: '/steep /brew /tea /feature',
            };
            return [2 /*return*/, (<Box flexDirection="column">
      {header}
      {lines}
      {isEmpty && <Text>{EMPTY}</Text>}
      {ENTRIES.map(function (entry, i) { return (<Button key={"menu:".concat(entry.view)} plain hotkey={entry.hotkey} {...(i === 0 ? { autoFocus: true } : {})} onPress={function () { return void (0, menu_controller_1.pressMenu)(p, entry.view); }}>
          {entry.label.padEnd(LABEL_WIDTH)}
          {entry.view === 'current' && needsYou ? (<Text color="warning">{(0, text_1.cut)(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>) : (<Text dimColor>{(0, text_1.cut)(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>)}
        </Button>); })}
      <Button key="menu:app" plain hotkey="8" onPress={function () { return void (0, menu_controller_1.pressOpenApp)(p); }}>
        {'Open in Queue-tea app'}
      </Button>
      {hints}
    </Box>)];
        });
    });
}
