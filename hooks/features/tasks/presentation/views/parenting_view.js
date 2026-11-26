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
exports.drawParenting = drawParenting;
var text_1 = require("../../../../core/widgets/text");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var queue_controller_1 = require("../state_management/queue_controller");
// Part of…: the features a task can go under, On its own, or Cancel. Asked
// from a backlog row or the current task, in the view it was asked from.
function drawParenting(c, parentingTask) {
    return __awaiter(this, void 0, void 0, function () {
        var p, Box, Text, Button, cols, tasks, feature, hints, top, bar, choices, under;
        return __generator(this, function (_a) {
            p = c.p, Box = c.Box, Text = c.Text, Button = c.Button, cols = c.cols, tasks = c.tasks, feature = c.feature, hints = c.hints, top = c.top, bar = c.bar;
            choices = (0, families_1.parentChoices)(tasks, parentingTask.id);
            under = (0, families_1.parentOf)(parentingTask, tasks);
            return [2 /*return*/, (<Box flexDirection="column">
      {top}
      {bar('suggestion', '◆ Part of…')}
      <Text>{(0, text_1.cut)("Which feature is ".concat(parentingTask.title, " part of?"), cols)}</Text>
      {under !== null && <Text dimColor>{(0, text_1.cut)("Now part of ".concat(under.title, "."), cols)}</Text>}
      {choices.length === 0 && <Text dimColor>No other open task it can go under.</Text>}
      {choices.map(function (t, n) { return (<Button key={"parent:".concat(t.id)} plain {...(n < 9 ? { hotkey: String(n + 1) } : {})} label={(0, text_1.cut)(t.title, cols - 3)} onPress={function () { return void (0, queue_controller_1.pressPartOfWith)(p, parentingTask.id, t.id); }}/>); })}
      {under !== null && (<Button key="parent:none" plain hotkey="0" label="On its own" onPress={function () { return void (0, queue_controller_1.pressPartOfWith)(p, parentingTask.id, null); }}/>)}
      <Button key="part-of-cancel" plain label="Cancel" onPress={function () { return void (0, queue_controller_1.pressCancelPartOf)(p); }}/>
      {hints}
    </Box>)];
        });
    });
}
