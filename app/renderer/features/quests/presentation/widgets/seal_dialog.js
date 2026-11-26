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
exports.SealDialog = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var quest_form_1 = require("../../domain/quest_form");
var SealDialog = function (_a) {
    var engine = _a.engine, realm = _a.realm, quest = _a.quest, isActive = _a.isActive, onSeal = _a.onSeal, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)({ waitFor: null, reason: '' }), form = _b[0], setForm = _b[1];
    var _c = (0, hooks_1.useState)(''), filter = _c[0], setFilter = _c[1];
    var _d = (0, hooks_1.useState)({ status: 'loading' }), choices = _d[0], setChoices = _d[1];
    var _e = (0, hooks_1.useState)(false), isTouched = _e[0], setTouched = _e[1];
    var _f = (0, hooks_1.useState)(null), failure = _f[0], setFailure = _f[1];
    var load = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setChoices({ status: 'loading' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readChoices(realm, quest.id); })];
                case 1:
                    answer = _a.sent();
                    setChoices(answer.ok ? { status: 'ready', data: answer.data.waitFor } : { status: 'failed', message: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    (0, hooks_1.useEffect)(function () {
        void load();
    }, []);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(true);
                    setFailure(null);
                    if ((0, quest_form_1.sealError)(form) !== undefined)
                        return [2 /*return*/];
                    return [4 /*yield*/, onSeal((0, quest_form_1.sealOf)(form))];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    var words = filter.trim().toLowerCase();
    var shown = choices.status === 'ready' ? choices.data.filter(function (c) { return c.title.toLowerCase().includes(words); }) : [];
    return (<dialog_1.Dialog title={en_1.t.form.sealTitle} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{en_1.t.form.sealAsk(quest.title)}</p>
      {isActive && <p class="form-line">{en_1.t.form.sealActive}</p>}
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      {choices.status === 'loading' && <states_1.Loading line={en_1.t.form.loading}/>}
      {choices.status === 'failed' && <states_1.Failed message={choices.message} onRetry={function () { return void load(); }}/>}
      {choices.status === 'ready' && choices.data.length === 0 && <p class="hint">{en_1.t.form.nothingToWaitFor}</p>}
      {choices.status === 'ready' && choices.data.length > 0 && (<>
          <field_1.Field label={en_1.t.form.filter} value={filter} onInput={setFilter}/>
          {shown.length === 0 && <p class="hint">{en_1.t.form.noFilterMatch}</p>}
          <div class="picks">
            {shown.map(function (choice) { return (<field_1.Pick key={choice.id} name="wait" label={choice.title} isPicked={form.waitFor === choice.id} onPick={function () { return setForm({ waitFor: choice.id, reason: '' }); }}/>); })}
          </div>
        </>)}
      <field_1.Field label={en_1.t.form.reason} value={form.reason} error={isTouched ? (0, quest_form_1.sealError)(form) : undefined} onInput={function (reason) { return setForm({ waitFor: null, reason: reason }); }} onBlur={function () { return setTouched(true); }}/>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.actions.sealIt}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.SealDialog = SealDialog;
