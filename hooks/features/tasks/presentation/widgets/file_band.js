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
exports.drawFileBand = drawFileBand;
var claude_ports_1 = require("../../../../core/ports/claude_ports");
var view_store_1 = require("../../../../core/store/view_store");
var text_1 = require("../../../../core/widgets/text");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var task_rules_1 = require("../../domain/services/task_rules");
var filing_controller_1 = require("../state_management/filing_controller");
var FEATURE_LABEL = 24;
function drawFileBand($, e, band, held) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, Box, Text, Button, record, offered, pick, isPicked, choice, naming, canSave;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = $.ui.resolve(e), Box = _a.Box, Text = _a.Text, Button = _a.Button;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'record')];
                case 1:
                    record = _c.sent();
                    offered = ((_b = band.choices) !== null && _b !== void 0 ? _b : [])
                        .map(function (id) { return record === null || record === void 0 ? void 0 : record.tasks.find(function (t) { return t.id === id; }); })
                        .filter(function (t) { return t !== undefined && (t.state === 'queued' || t.state === 'current'); });
                    pick = band.parent;
                    isPicked = function (p) {
                        return pick != null && pick.kind === p.kind && (p.kind !== 'task' || (pick.kind === 'task' && pick.id === p.id));
                    };
                    choice = function (key, label, p) {
                        return isPicked(p) ? (<Button key={key} label={label} variant="primary" onPress={function () { }}/>) : (<Button key={key} label={label} onPress={function () { return void (0, filing_controller_1.pickBand)((0, claude_ports_1.portsOf)($), { parent: p }); }}/>);
                    };
                    naming = (pick === null || pick === void 0 ? void 0 : pick.kind) !== 'new' || e.surface === 'mobile' ? null : (function () {
                        var Input = $.ui.resolve(e).Input;
                        return (<Input key="feature-title" label="New feature" placeholder="its name, then Enter" value={pick.title} submitLabel="Set" onSubmit={function (value) { return void (0, filing_controller_1.nameNewFeature)((0, claude_ports_1.portsOf)($), value); }}/>);
                    })();
                    canSave = pick !== null && !((pick === null || pick === void 0 ? void 0 : pick.kind) === 'new' && pick.title === '');
                    return [2 /*return*/, (<Box flexDirection="column">
      <Text>New task: {band.title}</Text>
      <Box>
        {queue_rules_1.PRIORITY_ORDER.map(function (p) {
                                return p === band.priority ? (<Button key={"prio:".concat(p)} label={p} variant="primary" onPress={function () { }}/>) : (<Button key={"prio:".concat(p)} label={p} onPress={function () { return void (0, filing_controller_1.pickBand)((0, claude_ports_1.portsOf)($), { priority: p }); }}/>);
                            })}
      </Box>
      <Box>
        {task_rules_1.DIFFICULTIES.map(function (d) {
                                return d === band.difficulty ? (<Button key={"diff:".concat(d)} label={d} variant="primary" onPress={function () { }}/>) : (<Button key={"diff:".concat(d)} label={d} onPress={function () { return void (0, filing_controller_1.pickBand)((0, claude_ports_1.portsOf)($), { difficulty: d }); }}/>);
                            })}
      </Box>
      {band.choices !== undefined && (<Box flexWrap="wrap">
          <Text>Part of </Text>
          {choice('parent:none', 'On its own', { kind: 'none' })}
          {offered.map(function (t) { return choice("parent:".concat(t.id), (0, text_1.cut)(t.title, FEATURE_LABEL), { kind: 'task', id: t.id }); })}
          {e.surface !== 'mobile' && choice('parent:new', 'New feature…', { kind: 'new', title: (pick === null || pick === void 0 ? void 0 : pick.kind) === 'new' ? pick.title : '' })}
        </Box>)}
      {pick === null && <Text color="warning">Is it part of a feature? Pick one, or On its own.</Text>}
      {naming}
      <Box>
        {canSave && <Button key="save" label="Save" variant="primary" onPress={function () { return void (0, filing_controller_1.saveFile)((0, claude_ports_1.portsOf)($)); }}/>}
        <Button key="same-task" label="Same task" onPress={held.sameTask}/>
        <Button key="cancel" label="Cancel" onPress={held.cancel}/>
      </Box>
    </Box>)];
            }
        });
    });
}
