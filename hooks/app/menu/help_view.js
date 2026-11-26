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
exports.HELP_COMMANDS = void 0;
exports.drawHelp = drawHelp;
// What Help lists: the commands, the most used first (/instant is /brew's
// other name), then the keys by where they work. A line fits 80 columns; a
// narrower menu wraps it rather than cut it.
exports.HELP_COMMANDS = [
    { usage: '/steep <message>', does: 'file it as a task for later, no check' },
    { usage: '/brew <request>', does: 'do it now, outside the queue (or /instant)' },
    { usage: '/tea <question>', does: 'ask or explain, changing no files' },
    { usage: '/feature [<title>|off]', does: 'show, set or clear the active feature' },
    { usage: '/done', does: 'ask whether the current task is done for now' },
    { usage: '/queue-tea', does: 'open this menu' },
];
var HELP_KEYS = [
    { where: 'Backlog', keys: 's start ★, or the open row · t time I have' },
    { where: 'Open row', keys: '1–5 priority · f play next · u unblock · x remove' },
    { where: 'Row or task', keys: 'k blocked… · p part of… · a active feature' },
    { where: 'Current task', keys: 'd done · b back to queue · c continue · w switch' },
    { where: '', keys: 'r check again · y / n to "Is this done for now?"' },
    { where: 'Record unreadable', keys: 'l use the last good copy · r try again' },
];
var HELP_WIDTH = 24;
function drawHelp(c) {
    return __awaiter(this, void 0, void 0, function () {
        var Box, Text, hints, top, bar, row;
        return __generator(this, function (_a) {
            Box = c.Box, Text = c.Text, hints = c.hints, top = c.top, bar = c.bar;
            row = function (left, right) { return (<Box>
      <Box width={HELP_WIDTH} flexShrink={0}>
        <Text>{left}</Text>
      </Box>
      <Text dimColor>{right}</Text>
    </Box>); };
            return [2 /*return*/, (<Box flexDirection="column">
      {top}
      {bar('inactive', '? Commands and keys')}
      {exports.HELP_COMMANDS.map(function (c) { return row(c.usage, c.does); })}
      {HELP_KEYS.map(function (k) { return row(k.where, k.keys); })}
      {hints}
    </Box>)];
        });
    });
}
