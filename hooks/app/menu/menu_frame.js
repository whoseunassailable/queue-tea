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
exports.renderMenu = renderMenu;
var help_view_1 = require("./help_view");
var home_view_1 = require("./home_view");
var current_view_1 = require("../../features/tasks/presentation/views/current_view");
var backlog_view_1 = require("../../features/tasks/presentation/views/backlog_view");
var blocking_view_1 = require("../../features/tasks/presentation/views/blocking_view");
var parenting_view_1 = require("../../features/tasks/presentation/views/parenting_view");
var format_1 = require("../../core/widgets/format");
var brew_view_1 = require("../../features/errands/presentation/views/brew_view");
var usage_view_1 = require("../../features/conversation/presentation/views/usage_view");
var history_view_1 = require("../../features/history/presentation/views/history_view");
var settings_view_1 = require("../../features/settings/presentation/views/settings_view");
var menu_context_1 = require("../../core/widgets/menu_context");
var claude_ports_1 = require("../../core/ports/claude_ports");
var menu_controller_1 = require("./menu_controller");
var session_rhythm_1 = require("../session/session_rhythm");
var commit_guard_controller_1 = require("../../features/commit_guard/presentation/state_management/commit_guard_controller");
var records_controller_1 = require("../../shared/records/presentation/state_management/records_controller");
var record_text_1 = require("../../shared/records/domain/constants/record_text");
var families_1 = require("../../shared/backlog/domain/services/families");
var live_1 = require("../../core/session/live");
var ranking_1 = require("../../shared/backlog/domain/services/ranking");
var view_store_1 = require("../../core/store/view_store");
var tea_cup_controller_1 = require("../../features/tea_cup/presentation/state_management/tea_cup_controller");
var queue_rules_1 = require("../../shared/records/domain/services/queue_rules");
var time_1 = require("../../shared/time/domain/services/time");
var allowance_1 = require("../../features/conversation/domain/services/allowance");
var keys_1 = require("../../core/widgets/keys");
var text_1 = require("../../core/widgets/text");
var week_stats_1 = require("../../shared/time/domain/services/week_stats");
var SPIN = '◐◓◑◒';
// The menu the tea cup opens: the list, or one of its views. Every press
// goes to the same actions the panel used; opening, moving between views and
// closing write nothing to the record.
function renderMenu($, e) {
    return __awaiter(this, void 0, void 0, function () {
        var els, Box, Text, Button, spin, _a, load, cols, problem, canRestore, view, record, tasks, current, budget, queue, blocked, waiting, blocking, parenting, openParents, feature, drift, others, allowance, notice, mismatch, hold, isAskingDone, isChoosingNext, isChecking, canContinue, openRow, checked, busy, warning, cup, offset, now, today, name, done, minutes, bar, header, lines, hints, top, tag, p, c, blockingTask, parentingTask;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    els = (0, menu_context_1.resolvePane)($, e);
                    Box = els.Box, Text = els.Text, Button = els.Button;
                    _a = SPIN;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'spin')];
                case 1:
                    spin = _a[(_j.sent()) % 4];
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'load')];
                case 2:
                    load = _j.sent();
                    cols = Math.max(20, e.props.bodyColumns);
                    if (load === 'loading') {
                        return [2 /*return*/, (<Box flexDirection="column">
        <Text>{spin} Reading your queue…</Text>
      </Box>)];
                    }
                    if (!(load === 'failed')) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'loadError')];
                case 3:
                    problem = _j.sent();
                    canRestore = (problem === null || problem === void 0 ? void 0 : problem.canRestore) === true;
                    return [2 /*return*/, (<Box flexDirection="column">
        <Text>{record_text_1.RECORD_TEXT.failed}</Text>
        {problem !== null && <Text color="warning">{(0, format_1.capital)(problem.reason)}.</Text>}
        <Text dimColor>{(_b = problem === null || problem === void 0 ? void 0 : problem.fix) !== null && _b !== void 0 ? _b : record_text_1.RECORD_TEXT.leftAsItIs(canRestore)}</Text>
        <Box>
          {canRestore && (<Button key="restore" label={record_text_1.RECORD_TEXT.restore} hotkey={keys_1.KEYS.restore} onPress={function () { return void (0, session_rhythm_1.pressRestore)((0, claude_ports_1.portsOf)($)); }}/>)}
          <Button key="retry" label={record_text_1.RECORD_TEXT.retry} hotkey={keys_1.KEYS.retry} onPress={function () { return void (0, records_controller_1.loadRecord)((0, claude_ports_1.portsOf)($)); }}/>
        </Box>
      </Box>)];
                case 4: return [4 /*yield*/, (0, view_store_1.getView)($, 'menuView')];
                case 5:
                    view = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'record')];
                case 6:
                    record = _j.sent();
                    tasks = (_c = record === null || record === void 0 ? void 0 : record.tasks) !== null && _c !== void 0 ? _c : [];
                    current = (0, queue_rules_1.currentTask)(tasks, live_1.live.ctx);
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'budget')
                        // The tasks that can start, in the order Start ★ takes them; the blocked
                        // ones apart.
                    ];
                case 7:
                    budget = _j.sent();
                    queue = record === null ? [] : (0, ranking_1.rankBacklog)(record, budget).map(function (r) { return r.task; });
                    blocked = (0, ranking_1.blockedTasks)(tasks);
                    waiting = queue.length + blocked.length;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'blocking')];
                case 8:
                    blocking = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'parenting')];
                case 9:
                    parenting = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'openParents')];
                case 10:
                    openParents = _j.sent();
                    feature = record === null ? null : (0, families_1.activeFeature)(record);
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'drift')];
                case 11:
                    drift = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'others')];
                case 12:
                    others = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'allowance')];
                case 13:
                    allowance = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'notice')];
                case 14:
                    notice = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'mismatch')];
                case 15:
                    mismatch = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'hold')];
                case 16:
                    hold = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'isAskingDone')];
                case 17:
                    isAskingDone = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'isChoosingNext')];
                case 18:
                    isChoosingNext = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'isChecking')];
                case 19:
                    isChecking = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'canContinue')];
                case 20:
                    canContinue = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'openRow')];
                case 21:
                    openRow = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'checked')];
                case 22:
                    checked = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'busy')];
                case 23:
                    busy = _j.sent();
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'warning')];
                case 24:
                    warning = _j.sent();
                    return [4 /*yield*/, (0, tea_cup_controller_1.readCup)((0, claude_ports_1.portsOf)($), false)];
                case 25:
                    cup = _j.sent();
                    offset = (_e = (_d = live_1.live.ctx) === null || _d === void 0 ? void 0 : _d.offsetMinutes) !== null && _e !== void 0 ? _e : 0;
                    return [4 /*yield*/, $.clock.now()];
                case 26:
                    now = _j.sent();
                    today = (0, time_1.dayKey)(now, offset);
                    name = (_g = (_f = live_1.live.ctx) === null || _f === void 0 ? void 0 : _f.projectName) !== null && _g !== void 0 ? _g : 'this project';
                    done = (0, week_stats_1.doneThisWeek)(tasks, today);
                    minutes = (0, week_stats_1.weekMinutes)(tasks, (_h = record === null || record === void 0 ? void 0 : record.unassignedMinutesByDay) !== null && _h !== void 0 ? _h : {}, today, record === null || record === void 0 ? void 0 : record.realmTime);
                    bar = function (color, text) { return (<Box backgroundColor={color}>
      <Text color="inverseText" bold>
        {(0, text_1.cut)(" ".concat(text, " "), cols)}
      </Text>
    </Box>); };
                    header = (<Box justifyContent="space-between">
      <Text bold>Queue-tea · {name}</Text>
      {allowance !== null && <Text dimColor>{(0, allowance_1.formatAllowance)(allowance, offset)}</Text>}
    </Box>);
                    lines = (<Box flexDirection="column">
      {warning !== null && (<Box>
          <Text color="warning">⚠ {warning} </Text>
          <Button key="dismiss-warning" plain hotkey={keys_1.KEYS.dismiss} label="OK" onPress={function () { return void (0, commit_guard_controller_1.pressDismissWarning)((0, claude_ports_1.portsOf)($)); }}/>
        </Box>)}
      {isChecking && <Text>{spin} Checking your message…</Text>}
      {busy !== null && (<Text>
          {spin} {busy}
        </Text>)}
      {notice !== null && <Text dimColor>{notice}</Text>}
    </Box>);
                    hints = (<Text dimColor>
      {(0, text_1.cut)(!e.props.isFocused
                            ? 'click or ctrl+x tab for keys · esc closes'
                            : view === 'menu'
                                ? '1–7 pick · tab move · enter press · esc close'
                                : 'm menu · tab move · enter press · esc close', cols)}
    </Text>);
                    top = (<Box flexDirection="column">
      {header}
      {lines}
      <Button key="menu:back" plain hotkey={keys_1.KEYS.menu} label="‹ Menu" onPress={function () { return void (0, menu_controller_1.pressMenu)((0, claude_ports_1.portsOf)($), 'menu'); }}/>
    </Box>);
                    tag = function (p) { return <Text color={format_1.PRIORITY_COLOR[p]}>[{p}]</Text>; };
                    p = (0, claude_ports_1.portsOf)($);
                    c = {
                        e: e,
                        p: p,
                        Box: Box,
                        Text: Text,
                        Button: Button,
                        view: view,
                        cols: cols,
                        now: now,
                        today: today,
                        offset: offset,
                        record: record,
                        tasks: tasks,
                        current: current,
                        budget: budget,
                        queue: queue,
                        blocked: blocked,
                        waiting: waiting,
                        feature: feature,
                        others: others,
                        allowance: allowance,
                        hold: hold,
                        isAskingDone: isAskingDone,
                        isChoosingNext: isChoosingNext,
                        canContinue: canContinue,
                        openRow: openRow,
                        checked: checked,
                        busy: busy,
                        drift: drift,
                        mismatch: mismatch,
                        openParents: openParents,
                        done: done,
                        minutes: minutes,
                        header: header,
                        lines: lines,
                        hints: hints,
                        top: top,
                        bar: bar,
                        tag: tag,
                    };
                    if (view === 'menu')
                        return [2 /*return*/, (0, home_view_1.drawHome)(c, cup)];
                    if (view === 'brew')
                        return [2 /*return*/, (0, brew_view_1.drawBrew)($, c)];
                    blockingTask = blocking === null ? undefined : tasks.find(function (t) { return t.id === blocking; });
                    if (blockingTask !== undefined && (view === 'backlog' || view === 'current'))
                        return [2 /*return*/, (0, blocking_view_1.drawBlocking)($, c, blockingTask)];
                    parentingTask = parenting === null ? undefined : tasks.find(function (t) { return t.id === parenting; });
                    if (parentingTask !== undefined && (view === 'backlog' || view === 'current'))
                        return [2 /*return*/, (0, parenting_view_1.drawParenting)(c, parentingTask)];
                    if (view === 'backlog')
                        return [2 /*return*/, (0, backlog_view_1.drawBacklog)($, c)];
                    if (view === 'current')
                        return [2 /*return*/, (0, current_view_1.drawCurrent)(c)];
                    if (view === 'history')
                        return [2 /*return*/, (0, history_view_1.drawHistory)(c)];
                    if (view === 'usage')
                        return [2 /*return*/, (0, usage_view_1.drawUsage)(c)];
                    if (view === 'help')
                        return [2 /*return*/, (0, help_view_1.drawHelp)(c)];
                    return [2 /*return*/, (0, settings_view_1.drawSettings)(c)];
            }
        });
    });
}
