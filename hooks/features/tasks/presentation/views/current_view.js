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
exports.drawCurrent = drawCurrent;
var format_1 = require("../../../../core/widgets/format");
var keys_1 = require("../../../../core/widgets/keys");
var text_1 = require("../../../../core/widgets/text");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var card_note_1 = require("../../../../shared/checkpoints/domain/services/card_note");
var time_1 = require("../../../../shared/time/domain/services/time");
var queue_controller_1 = require("../state_management/queue_controller");
var tasks_controller_1 = require("../state_management/tasks_controller");
var tasks_text_1 = require("../constants/tasks_text");
var family_buttons_1 = require("../widgets/family_buttons");
function drawCurrent(c) {
    return __awaiter(this, void 0, void 0, function () {
        var p, Box, Text, Button, cols, now, today, tasks, current, queue, feature, hold, isAskingDone, canContinue, openRow, checked, busy, drift, mismatch, done, hints, top, bar, tag, currentParent, currentFamily, handoffCard;
        var _a;
        return __generator(this, function (_b) {
            p = c.p, Box = c.Box, Text = c.Text, Button = c.Button, cols = c.cols, now = c.now, today = c.today, tasks = c.tasks, current = c.current, queue = c.queue, feature = c.feature, hold = c.hold, isAskingDone = c.isAskingDone, canContinue = c.canContinue, openRow = c.openRow, checked = c.checked, busy = c.busy, drift = c.drift, mismatch = c.mismatch, done = c.done, hints = c.hints, top = c.top, bar = c.bar, tag = c.tag;
            currentParent = current === null ? null : (0, families_1.parentOf)(current, tasks);
            currentFamily = current === null
                ? null
                : currentParent !== null
                    ? "part of ".concat(currentParent.title, " \u00B7 ").concat((0, families_1.progressText)((0, families_1.progressOf)(currentParent, tasks)))
                    : (0, families_1.childrenOf)(current, tasks).length > 0
                        ? "feature \u00B7 ".concat((0, families_1.progressText)((0, families_1.progressOf)(current, tasks))).concat((feature === null || feature === void 0 ? void 0 : feature.id) === current.id ? ' · active feature' : '')
                        : (feature === null || feature === void 0 ? void 0 : feature.id) === current.id
                            ? 'active feature'
                            : null;
            handoffCard = function (task) {
                var note = (0, card_note_1.cardNote)(task);
                if (note === null)
                    return null;
                var sections = note.sections, written = note.written;
                var when = written.slice(0, 10) === today ? written.slice(11, 16) : "".concat(written.slice(0, 10), " ").concat(written.slice(11, 16));
                return (<Box flexDirection="column" borderStyle="round" borderColor="subtle" paddingX={1}>
        <Text bold>
          {note.title} <Text dimColor>· {when}</Text>
        </Text>
        {sections === null ? (<Text>{note.text}</Text>) : (sections.map(function (s, i) { return (<Box flexDirection="column">
              <Text bold color="suggestion">
                {i + 1} {s.heading}
              </Text>
              {s.lines.map(function (line) { return (<Text>{line.startsWith('- ') ? "".concat((0, format_1.markFor)(s.heading), " ").concat(line.slice(2)) : line}</Text>); })}
            </Box>); }))}
      </Box>);
            };
            return [2 /*return*/, (<Box flexDirection="column">
      {top}
      {bar('warning', current === null ? '▶ In progress' : '▶ In progress (1)')}
      {current === null ? (<Box flexDirection="column">
          <Text dimColor>No task in progress.</Text>
          {queue.length > 0 && openRow === null && hold === null && (<Button key="start-next" plain hotkey={keys_1.KEYS['start-next']} label={(0, text_1.cut)("Start \u2605 ".concat(queue[0].title), cols - 3)} onPress={function () { return void (0, tasks_controller_1.pressStartNext)(p); }}/>)}
        </Box>) : (<Box flexDirection="column">
          <Text>
            {'  '}
            {tag(current.priority)} {(0, text_1.cut)(current.title, cols - current.priority.length - 5)}
          </Text>
          <Text dimColor>
            {(0, text_1.cut)("  ".concat((0, format_1.capital)(current.difficulty.expected), " \u00B7 ").concat((_a = current.branch) !== null && _a !== void 0 ? _a : 'no branch', " \u00B7 ").concat((0, time_1.formatMinutes)((0, format_1.total)(current.minutesByDay))), cols)}
          </Text>
          {current.step !== undefined && (<Text dimColor={current.step.status !== 'running'}>{(0, text_1.cut)("  ".concat((0, tasks_text_1.STEP_LINE)(current.step)), cols)}</Text>)}
          {currentFamily !== null && <Text dimColor>{(0, text_1.cut)("  \u25C6 ".concat(currentFamily), cols)}</Text>}
          {drift.map(function (line) { return (<Text color="warning">{(0, text_1.cut)("! ".concat(line), cols)}</Text>); })}
        </Box>)}
      {mismatch !== null && (<Box flexDirection="column">
          <Text>{mismatch}</Text>
          <Button key="switch" plain hotkey={keys_1.KEYS.switch} label="Switch" onPress={function () { return void (0, tasks_controller_1.pressSwitch)(p); }}/>
        </Box>)}
      {hold !== null && (<Box flexDirection="column">
          <Text>{hold.text}</Text>
          <Button key="check-again" plain hotkey={keys_1.KEYS['check-again']} label="Check again" onPress={function () { return void (0, tasks_controller_1.pressCheckAgain)(p); }}/>
        </Box>)}
      {isAskingDone && current !== null && (<Box flexDirection="column">
          <Text>Is this done for now?</Text>
          {checked !== null && <Text dimColor>Claude checked: {checked}</Text>}
          <Box gap={2}>
            <Button key="done-yes" plain hotkey={keys_1.KEYS.yes} label="Yes" onPress={function () { return void (0, tasks_controller_1.pressDoneYes)(p); }}/>
            <Button key="done-not-yet" plain hotkey={keys_1.KEYS.notYet} label="Not yet" onPress={function () { return void (0, tasks_controller_1.pressDoneNotYet)(p); }}/>
          </Box>
        </Box>)}
      {canContinue && current !== null && (<Box flexDirection="column">
          {handoffCard(current)}
          <Button key="continue" plain hotkey={keys_1.KEYS.continue} label="Continue" onPress={function () { return void (0, tasks_controller_1.pressContinue)(p); }}/>
        </Box>)}
      {current !== null && busy === null && (<Box flexWrap="wrap" columnGap={2}>
          {!isAskingDone && <Button key="done" plain hotkey={keys_1.KEYS.done} label="Done" onPress={function () { return void (0, tasks_controller_1.pressDoneYes)(p); }}/>}
          <Button key="back" plain hotkey={keys_1.KEYS.back} label="Back to queue" onPress={function () { return void (0, tasks_controller_1.pressBackToQueue)(p); }}/>
          <Button key={"block:".concat(current.id)} plain hotkey={keys_1.KEYS.block} label="Blocked…" onPress={function () { return void (0, queue_controller_1.pressBlock)(p, current.id); }}/>
          {(0, family_buttons_1.familyButtons)(c, current)}
        </Box>)}
      {hints}
    </Box>)];
        });
    });
}
