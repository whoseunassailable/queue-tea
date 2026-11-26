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
exports.drawBacklog = drawBacklog;
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var tasks_controller_1 = require("../state_management/tasks_controller");
var format_1 = require("../../../../core/widgets/format");
var keys_1 = require("../../../../core/widgets/keys");
var text_1 = require("../../../../core/widgets/text");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
var filing_controller_1 = require("../state_management/filing_controller");
var queue_controller_1 = require("../state_management/queue_controller");
var family_buttons_1 = require("../widgets/family_buttons");
function drawBacklog($, c) {
    return __awaiter(this, void 0, void 0, function () {
        var e, Box, Text, Button, p, cols, now, record, tasks, current, budget, queue, blocked, waiting, feature, others, isChoosingNext, openRow, openParents, hints, top, bar, tag, ranked, rowButtons, newTask, star, readyRow, blockedRow, groupRows, _a, ready, stuck, stuckCount;
        return __generator(this, function (_b) {
            e = c.e, Box = c.Box, Text = c.Text, Button = c.Button, p = c.p, cols = c.cols, now = c.now, record = c.record, tasks = c.tasks, current = c.current, budget = c.budget, queue = c.queue, blocked = c.blocked, waiting = c.waiting, feature = c.feature, others = c.others, isChoosingNext = c.isChoosingNext, openRow = c.openRow, openParents = c.openParents, hints = c.hints, top = c.top, bar = c.bar, tag = c.tag;
            ranked = record === null ? [] : (0, ranking_1.rankBacklog)(record, budget);
            rowButtons = function (task, isBlockedRow) { return (<Box flexWrap="wrap" columnGap={2}>
      {current === null && !isBlockedRow && (<Button key={"start:".concat(task.id)} plain hotkey={keys_1.KEYS['start-next']} label="Start" onPress={function () { return void (0, tasks_controller_1.pressStartFromBacklog)(p, task.id); }}/>)}
      {queue_rules_1.PRIORITY_ORDER.map(function (level, n) { return (<Button key={"prio:".concat(task.id, ":").concat(level)} plain hotkey={String(n + 1)} label={level === task.priority ? "".concat(level, " \u2022") : level} onPress={function () { return (level === task.priority ? undefined : void (0, queue_controller_1.pressPriority)(p, task.id, level)); }}/>); })}
      {!isBlockedRow && (<Button key={"play-next:".concat(task.id)} plain hotkey={keys_1.KEYS.playNext} label={(record === null || record === void 0 ? void 0 : record.playNext) === task.id ? 'Play next •' : 'Play next'} onPress={function () { return void (0, queue_controller_1.pressPlayNext)(p, task.id); }}/>)}
      {!isBlockedRow && (<Button key={"block:".concat(task.id)} plain hotkey={keys_1.KEYS.block} label="Blocked…" onPress={function () { return void (0, queue_controller_1.pressBlock)(p, task.id); }}/>)}
      {isBlockedRow && (<Button key={"unblock:".concat(task.id)} plain hotkey={keys_1.KEYS.unblock} label="Unblock" onPress={function () { return void (0, queue_controller_1.pressUnblock)(p, task.id); }}/>)}
      {(0, family_buttons_1.familyButtons)(c, task)}
      <Button key={"remove:".concat(task.id)} plain hotkey={keys_1.KEYS.remove} label="Remove" onPress={function () { return void (0, queue_controller_1.pressRemove)(p, task.id); }}/>
    </Box>); };
            newTask = e.surface === 'mobile' ? null : (function () {
                var Input = $.ui.resolve(e).Input;
                return (<Input key="new-task" label="New task" placeholder="Type it, then Enter" submitLabel="File" onSubmit={function (value) {
                        if (value.trim() !== '')
                            void (0, filing_controller_1.fileFromCommand)(p, value.trim());
                    }}/>);
            })();
            star = ranked[0];
            readyRow = function (r, pad) {
                var task = r.task;
                var isStar = r === star;
                var waited = (0, time_1.formatAge)(now - Date.parse(task.created));
                var soFar = (0, format_1.total)(task.minutesByDay);
                var dim = __spreadArray(__spreadArray([
                    (0, format_1.capital)(task.difficulty.expected),
                    "~".concat((0, ranking_1.formatSpan)(r.estimate)).concat(r.isShort ? ' short' : ''),
                    "waited ".concat(waited)
                ], (task.branch === null ? [] : [task.branch]), true), (soFar > 0 ? ["".concat((0, time_1.formatMinutes)(soFar), " so far")] : []), true).join(' · ');
                return (<Box flexDirection="column">
        <Button key={"row:".concat(task.id)} plain {...(isStar ? { autoFocus: true } : {})} onPress={function () { return void (0, queue_controller_1.pressRow)(p, task.id); }}>
          {pad}
          {isStar ? '★ ' : '  '}
          {tag(task.priority)} {(0, text_1.cut)(task.title, cols - task.priority.length - 5 - pad.length)}
        </Button>
        <Text dimColor>{(0, text_1.cut)("".concat(pad, "  ").concat(dim), cols)}</Text>
        {isStar && <Text dimColor>{(0, text_1.cut)("".concat(pad, "  ").concat(r.why), cols)}</Text>}
        {openRow === task.id && rowButtons(task, false)}
      </Box>);
            };
            blockedRow = function (task, pad) { return (<Box flexDirection="column">
      <Button key={"row:".concat(task.id)} plain onPress={function () { return void (0, queue_controller_1.pressRow)(p, task.id); }}>
        {pad}
        {'  '}
        {tag(task.priority)} {(0, text_1.cut)(task.title, cols - task.priority.length - 5 - pad.length)}
      </Button>
      <Text dimColor>{(0, text_1.cut)("".concat(pad, "  ").concat((0, ranking_1.blockedText)(task, tasks)), cols)}</Text>
      {openRow === task.id && rowButtons(task, true)}
    </Box>); };
            groupRows = function (g) {
                var parent = g.parent;
                var isOpen = openParents.includes(parent.id);
                var isQueued = parent.state === 'queued';
                var starHere = g.hasStar ? star : undefined;
                var mark = parent.state === 'current' ? '▶ ' : parent.state === 'done' ? '✓ ' : '';
                var finished = (0, families_1.childrenOf)(parent, tasks).filter(function (t) { return t.state === 'current' || t.state === 'done'; });
                return (<Box flexDirection="column">
        <Box>
          <Text>{g.hasStar ? '★ ' : '  '}</Text>
          <Button key={"fold:".concat(parent.id)} plain label={isOpen ? '▾' : '▸'} onPress={function () { return void (0, queue_controller_1.pressFold)(p, parent.id); }}/>
          <Text> </Text>
          <Button key={"row:".concat(parent.id)} plain {...(g.hasStar ? { autoFocus: true } : {})} onPress={function () { return void (isQueued ? (0, queue_controller_1.pressRow)(p, parent.id) : (0, queue_controller_1.pressFold)(p, parent.id)); }}>
            {mark}
            {tag(parent.priority)} {(0, text_1.cut)(parent.title, cols - parent.priority.length - 7 - mark.length)}
          </Button>
        </Box>
        <Text dimColor>
          {(0, text_1.cut)("    \u25C6 ".concat((0, families_1.progressText)((0, families_1.progressOf)(parent, tasks))).concat((feature === null || feature === void 0 ? void 0 : feature.id) === parent.id ? ' · active feature' : ''), cols)}
        </Text>
        {starHere !== undefined && (starHere.task === parent || !isOpen) && (<Text dimColor>{(0, text_1.cut)("    ".concat(starHere.task === parent ? '' : "\u2605 ".concat(starHere.task.title, " \u00B7 ")).concat(starHere.why), cols)}</Text>)}
        {openRow === parent.id && isQueued && rowButtons(parent, (0, ranking_1.isBlocked)(parent, tasks))}
        {isOpen && g.rows.filter(function (r) { return r.task !== parent; }).map(function (r) { return readyRow(r, '  '); })}
        {isOpen && g.blocked.filter(function (t) { return t !== parent; }).map(function (t) { return blockedRow(t, '  '); })}
        {isOpen &&
                        finished.map(function (t) { return (<Text dimColor>{(0, text_1.cut)("      ".concat(t.state === 'current' ? '▶' : '✓', " ").concat(t.title).concat(t.state === 'current' ? ' · in progress' : ''), cols)}</Text>); })}
      </Box>);
            };
            _a = (0, families_1.groupBacklog)(ranked, blocked, tasks), ready = _a.ready, stuck = _a.blocked;
            stuckCount = stuck.reduce(function (n, entry) { return n + (entry.kind === 'group' ? entry.group.blocked.length : 1); }, 0);
            return [2 /*return*/, (<Box flexDirection="column">
      {top}
      {bar('inactive', "\u25CB Backlog".concat(queue.length > 0 ? " (".concat(queue.length, ")") : ''))}
      {feature !== null && (<Box>
          <Text dimColor>{(0, text_1.cut)("\u25C6 Active feature: ".concat(feature.title, " "), cols - 6)}</Text>
          <Button key="feature:clear" plain label="Clear" onPress={function () { return void (0, queue_controller_1.pressClearFeature)(p); }}/>
        </Box>)}
      {waiting === 0 && <Text dimColor>Nothing waiting.</Text>}
      {waiting > 0 && queue.length === 0 && <Text dimColor>Nothing can start: every task waiting is blocked.</Text>}
      {waiting > 0 && (<Button key="time" plain hotkey={keys_1.KEYS.time} label={"Time I have: ".concat((0, ranking_1.budgetLabel)(budget))} onPress={function () { return void (0, queue_controller_1.pressBudget)(p); }}/>)}
      {isChoosingNext && queue.length > 0 && current === null && (<Text dimColor>Pick the next task: s starts ★, or press a row.</Text>)}
      {ready.map(function (entry) { return (entry.kind === 'group' ? groupRows(entry.group) : entry.kind === 'task' ? readyRow(entry.row, '') : null); })}
      {stuckCount > 0 && bar('error', "\u2298 Blocked (".concat(stuckCount, ")"))}
      {stuck.map(function (entry) { return (entry.kind === 'group' ? groupRows(entry.group) : entry.kind === 'blocked' ? blockedRow(entry.task, '') : null); })}
      {others.length > 0 && bar('inactive', "\u25C7 Other projects (".concat(others.length, ")"))}
      {others.map(function (o) { return (<Text dimColor>{(0, text_1.cut)("".concat(o.name, " \u00B7 ").concat(o.waiting, " waiting \u00B7 ").concat(o.next === null ? 'all blocked' : "\u2605 ".concat(o.next)), cols)}</Text>); })}
      {newTask}
      {hints}
    </Box>)];
        });
    });
}
