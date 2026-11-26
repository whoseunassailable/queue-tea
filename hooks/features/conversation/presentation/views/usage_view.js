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
exports.drawUsage = drawUsage;
var format_1 = require("../../../../core/widgets/format");
var text_1 = require("../../../../core/widgets/text");
var time_1 = require("../../../../shared/time/domain/services/time");
var week_stats_1 = require("../../../../shared/time/domain/services/week_stats");
var allowance_1 = require("../../domain/services/allowance");
function drawUsage(c) {
    return __awaiter(this, void 0, void 0, function () {
        var p, Box, Text, cols, today, offset, record, tasks, current, allowance, minutes, lines, hints, top, bar, todayMinutes, outside, effort, measured, linesSoFar;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    p = c.p, Box = c.Box, Text = c.Text, cols = c.cols, today = c.today, offset = c.offset, record = c.record, tasks = c.tasks, current = c.current, allowance = c.allowance, minutes = c.minutes, lines = c.lines, hints = c.hints, top = c.top, bar = c.bar;
                    todayMinutes = (_a = minutes[(0, week_stats_1.weekOf)(today).indexOf(today)]) !== null && _a !== void 0 ? _a : 0;
                    outside = (0, format_1.sum)((0, week_stats_1.weekOf)(today).map(function (day) { var _a; return (_a = record === null || record === void 0 ? void 0 : record.unassignedMinutesByDay[day]) !== null && _a !== void 0 ? _a : 0; }));
                    effort = current === null || current === void 0 ? void 0 : current.effort;
                    return [4 /*yield*/, p.get('lines')];
                case 1:
                    measured = _b.sent();
                    linesSoFar = measured === null || measured.taskId !== (current === null || current === void 0 ? void 0 : current.id) ? '' : " \u00B7 +".concat(measured.added, " \u2212").concat(measured.removed, " lines");
                    return [2 /*return*/, (<Box flexDirection="column">
      {top}
      {bar('suggestion', '◔ Usage & time')}
      <Text>5-hour allowance: {allowance === null ? 'not reported yet' : (0, allowance_1.formatAllowance)(allowance, offset).replace(/^5h: /, '')}</Text>
      <Text>
        Today {(0, time_1.formatMinutes)(todayMinutes)} · this week {(0, time_1.formatMinutes)((0, format_1.sum)(minutes))}
      </Text>
      <Text color="success">{(0, week_stats_1.weekChart)(minutes)}</Text>
      {current !== null && effort !== undefined && (<Box flexDirection="column">
          <Text>{(0, text_1.cut)("Current task: ".concat(current.title, " \u00B7 ").concat((0, time_1.formatMinutes)((0, format_1.total)(current.minutesByDay))), cols)}</Text>
          <Text dimColor>
            {(0, text_1.cut)("  ".concat(effort.understandingMessages, " understanding \u00B7 ").concat(effort.improvingMessages, " improving messages"), cols)}
          </Text>
          <Text dimColor>
            {(0, text_1.cut)("  ".concat(effort.filesRead, " files read \u00B7 ").concat(effort.filesChanged, " changed").concat(linesSoFar), cols)}
          </Text>
        </Box>)}
      <Text dimColor>Outside tasks this week: {(0, time_1.formatMinutes)(outside)}</Text>
      {hints}
    </Box>)];
            }
        });
    });
}
