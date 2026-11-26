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
exports.DueControl = void 0;
var hooks_1 = require("preact/hooks");
var calendar_1 = require("../../../../../shared/calendar");
var calendar_time_1 = require("../../../../../shared/calendar_time");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var calendar_days_1 = require("../../../calendar/domain/calendar_days");
// The day a quest is due, saved when the field loses focus or on Return, so
// a year typed digit by digit is never saved half-way. Clear takes it off.
// The quest then shows on that day of the realm's calendar.
var DueControl = function (_a) {
    var _b;
    var due = _a.due, onChange = _a.onChange, _c = _a.today, today = _c === void 0 ? (0, calendar_days_1.todayIn)((0, calendar_time_1.hereZone)(), Date.now()) : _c;
    var id = (0, hooks_1.useId)();
    var _d = (0, hooks_1.useState)(null), draft = _d[0], setDraft = _d[1];
    var _e = (0, hooks_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, hooks_1.useState)(false), isSaving = _f[0], setSaving = _f[1];
    var isSending = (0, hooks_1.useRef)(false);
    var shown = (_b = draft !== null && draft !== void 0 ? draft : due) !== null && _b !== void 0 ? _b : '';
    var save = function (next) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (next === due) {
                        setDraft(null);
                        setError(null);
                        return [2 /*return*/];
                    }
                    if (isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    setSaving(true);
                    return [4 /*yield*/, onChange(next)];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    setSaving(false);
                    setError(answer.ok ? null : answer.message);
                    if (answer.ok)
                        setDraft(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var check = function () {
        var value = shown.trim();
        if (value === '')
            return void (due === null ? setError(null) : save(null));
        if (!(0, calendar_1.isDay)(value))
            return void setError(en_1.t.detail.dueBad);
        void save(value);
    };
    var away = due === null ? 0 : (0, calendar_days_1.daysFrom)(today, due);
    return (<div class="form-field due-field">
      <label for={id}>{en_1.t.detail.due}</label>
      <div class="due-row">
        <input id={id} type="date" class="input" value={shown} aria-invalid={error === null ? undefined : 'true'} aria-describedby={error === null ? "".concat(id, "-hint") : "".concat(id, "-error ").concat(id, "-hint")} onInput={function (event) { return setDraft(event.target.value); }} onBlur={check} onKeyDown={function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                check();
            }
        }}/>
        {due !== null && (<button type="button" class="chip-btn" disabled={isSaving} onClick={function () { return void save(null); }}>
            {en_1.t.detail.dueClear}
          </button>)}
      </div>
      {error !== null && (<p class="field-error" id={"".concat(id, "-error")}>
          {error}
        </p>)}
      <p class="hint" id={"".concat(id, "-hint")} role={isSaving ? 'status' : undefined}>
        {isSaving ? (<>
            <states_1.Spinner />
            {en_1.t.detail.dueSaving}
          </>) : due === null ? (en_1.t.detail.dueNone) : away < 0 ? (en_1.t.detail.dueOverdue(due, away)) : (en_1.t.detail.dueOn(due, away))}
      </p>
    </div>);
};
exports.DueControl = DueControl;
