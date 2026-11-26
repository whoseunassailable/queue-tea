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
exports.renderBand = renderBand;
var difficulty_band_1 = require("../../features/tasks/presentation/widgets/difficulty_band");
var docs_path_band_1 = require("../../features/tasks/presentation/widgets/docs_path_band");
var message_check_controller_1 = require("../../features/message_check/presentation/state_management/message_check_controller");
var file_band_1 = require("../../features/tasks/presentation/widgets/file_band");
var unsure_band_1 = require("../../features/message_check/presentation/widgets/unsure_band");
var claude_ports_1 = require("../../core/ports/claude_ports");
var menu_controller_1 = require("../menu/menu_controller");
var view_store_1 = require("../../core/store/view_store");
var tea_cup_controller_1 = require("../../features/tea_cup/presentation/state_management/tea_cup_controller");
var cup_mood_1 = require("../../features/tea_cup/domain/services/cup_mood");
var keys_1 = require("../../core/widgets/keys");
var text_1 = require("../../core/widgets/text");
// Narrower than this, the band has the words without the cup.
var CUP_MIN_COLUMNS = 40;
var MOOD_WORD = { idle: 'idle', working: 'brewing', attention: 'needs you', done: 'done' };
var MOOD_COLOR = { idle: 'inactive', working: 'suggestion', attention: 'warning', done: 'success' };
// The band: the tea cup, always, with what Queue-tea is doing beside it, or
// the question Queue-tea is asking. Null only while a survey holds the band.
function renderBand($, e) {
    return __awaiter(this, void 0, void 0, function () {
        var band, _a, Box, Text, Button, cup, art, question, isMenuOpen, room, how;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (e.props.hasSurvey)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'band')];
                case 1:
                    band = _c.sent();
                    _a = $.ui.resolve(e), Box = _a.Box, Text = _a.Text, Button = _a.Button;
                    return [4 /*yield*/, (0, tea_cup_controller_1.readCup)((0, claude_ports_1.portsOf)($), e.props.isWorking)];
                case 2:
                    cup = _c.sent();
                    return [4 /*yield*/, drawCup($, e, cup.mood)];
                case 3:
                    art = _c.sent();
                    if (!(band.kind !== 'none')) return [3 /*break*/, 5];
                    return [4 /*yield*/, drawQuestion($, e, band)];
                case 4:
                    question = _c.sent();
                    return [2 /*return*/, art === null ? question : (<Box gap={1}>
        {art}
        {question}
      </Box>)];
                case 5: return [4 /*yield*/, (0, view_store_1.getView)($, 'isMenuOpen')];
                case 6:
                    isMenuOpen = _c.sent();
                    room = e.props.bodyColumns - (art === null ? 0 : cup_mood_1.CUP_COLUMNS + 1);
                    how = art !== null && ((_b = e.viewport) === null || _b === void 0 ? void 0 : _b.isFullscreen) === true ? ' · /queue-tea, or click the cup' : ' · /queue-tea';
                    return [2 /*return*/, (<Box gap={1}>
      {art}
      <Box flexDirection="column">
        <Text>
          <Text bold>Queue-tea</Text> <Text color={MOOD_COLOR[cup.mood]}>{MOOD_WORD[cup.mood]}</Text>
        </Text>
        {cup.mood === 'attention' ? (<Text color="warning">{(0, text_1.cut)(cup.line, room)}</Text>) : (<Text dimColor>{(0, text_1.cut)(cup.line, room)}</Text>)}
        <Box>
          <Button key="cup-menu" plain hotkey={keys_1.KEYS.menu} label={isMenuOpen ? 'Close menu' : 'Menu'} onPress={function () { return void (0, menu_controller_1.toggleMenu)((0, claude_ports_1.portsOf)($)); }}/>
          <Text dimColor>{(0, text_1.cut)(how, room - 12)}</Text>
        </Box>
      </Box>
    </Box>)];
            }
        });
    });
}
// The cup: animated by its surface module where the surface runs one, still
// where it does not or the module failed, left out where the band is narrow.
function drawCup($, e, mood) {
    return __awaiter(this, void 0, void 0, function () {
        var art, Client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (e.props.bodyColumns < CUP_MIN_COLUMNS)
                        return [2 /*return*/, null];
                    art = (0, cup_mood_1.cupArt)(mood);
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'isCupStill')];
                case 1:
                    if (!(_a.sent()) && (e.surface === 'terminal' || e.surface === 'desktop')) {
                        Client = $.ui.resolve(e).Client;
                        return [2 /*return*/, <Client key="cup" module="../../features/tea_cup/presentation/views/teacup.tsx" props={art} width={cup_mood_1.CUP_COLUMNS} height={cup_mood_1.CUP_ROWS}/>];
                    }
                    return [2 /*return*/, stillCup($, e, art.frames[0])];
            }
        });
    });
}
function stillCup($, e, frame) {
    var _a = $.ui.resolve(e), Box = _a.Box, Text = _a.Text;
    return (<Box flexDirection="column">
      {frame.map(function (row) { return (<Text>
          {row.map(function (seg) { return (<Text {...(seg.color === undefined ? {} : { color: seg.color })} {...(seg.backgroundColor === undefined ? {} : { backgroundColor: seg.backgroundColor })} {...(seg.bold === true ? { bold: true } : {})}>
              {seg.text}
            </Text>); })}
        </Text>); })}
    </Box>);
}
// What the band asks: a held message's priority and what it is part of, the
// can't-tell choice, the difficulty at the end of a task, the docs log's path.
function drawQuestion($, e, band) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (band.kind === 'file') {
                return [2 /*return*/, (0, file_band_1.drawFileBand)($, e, band, { sameTask: function () { return void (0, message_check_controller_1.sendAsTask)((0, claude_ports_1.portsOf)($)); }, cancel: function () { return void (0, message_check_controller_1.cancelHeld)((0, claude_ports_1.portsOf)($)); } })];
            }
            if (band.kind === 'unsure')
                return [2 /*return*/, (0, unsure_band_1.drawUnsureBand)($, e, band)];
            if (band.kind === 'difficulty')
                return [2 /*return*/, (0, difficulty_band_1.drawDifficultyBand)($, e, band)];
            return [2 /*return*/, (0, docs_path_band_1.drawDocsPathBand)($, e, band)];
        });
    });
}
