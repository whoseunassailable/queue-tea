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
exports.MoveDialog = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
// `preset` is what a quest was dragged onto. It's offered even when the engine
// wouldn't list it: the move is refused with the engine's own sentence.
var MoveDialog = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, realm = _a.realm, quest = _a.quest, preset = _a.preset, edits = _a.edits, onClose = _a.onClose;
    var _e = (0, hooks_1.useState)((_b = preset === null || preset === void 0 ? void 0 : preset.id) !== null && _b !== void 0 ? _b : null), picked = _e[0], setPicked = _e[1];
    var _f = (0, hooks_1.useState)({ status: 'loading' }), choices = _f[0], setChoices = _f[1];
    var _g = (0, hooks_1.useState)(undefined), error = _g[0], setError = _g[1];
    var load = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setChoices({ status: 'loading' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readChoices(realm, quest.id); })];
                case 1:
                    answer = _a.sent();
                    setChoices(answer.ok ? { status: 'ready', data: answer.data.parents } : { status: 'failed', message: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    (0, hooks_1.useEffect)(function () {
        void load();
    }, []);
    var listed = choices.status === 'ready' ? choices.data : [];
    var data = preset === undefined || listed.some(function (c) { return c.id === preset.id; }) ? listed : __spreadArray(__spreadArray([], listed, true), [{ id: preset.id, title: preset.title, detail: null }], false);
    var pickedTitle = picked === 'alone' ? en_1.t.form.alone : ((_d = (_c = data.find(function (c) { return c.id === picked; })) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : null);
    var canGoAlone = quest.parentId !== null;
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isAlone, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (picked === null) {
                        setError(en_1.t.form.pickMove);
                        return [2 /*return*/];
                    }
                    isAlone = picked === 'alone';
                    return [4 /*yield*/, edits.move(realm, quest, isAlone ? null : picked, isAlone ? null : pickedTitle)];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        onClose();
                    else
                        setError(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.form.moveTitle} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {choices.status === 'loading' && <states_1.Loading line={en_1.t.form.loading}/>}
      {choices.status === 'failed' && <states_1.Failed message={choices.message} onRetry={function () { return void load(); }}/>}
      {choices.status === 'ready' && (<field_1.Group label={en_1.t.form.moveTo} error={error}>
          {data.length === 0 && !canGoAlone && <p class="hint">{en_1.t.form.noMoves}</p>}
          <div class="picks">
            {canGoAlone && <field_1.Pick name="move" label={en_1.t.form.alone} isPicked={picked === 'alone'} onPick={function () { return setPicked('alone'); }}/>}
            {data.map(function (choice) { return (<field_1.Pick key={choice.id} name="move" label={choice.title} detail={choice.detail} isPicked={picked === choice.id} onPick={function () { return setPicked(choice.id); }}/>); })}
          </div>
        </field_1.Group>)}
      {pickedTitle !== null && <p class="form-line">{en_1.t.form.moveLine(quest.title, pickedTitle)}</p>}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.actions.move}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.MoveDialog = MoveDialog;
