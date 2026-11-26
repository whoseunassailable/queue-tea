"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.NextVersionSheet = void 0;
var hooks_1 = require("preact/hooks");
var queue_rules_1 = require("../../../../../../hooks/shared/records/domain/services/queue_rules");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var en_1 = require("../../../../l10n/en");
var design_forms_1 = require("../../domain/design_forms");
var NextVersionSheet = function (_a) {
    var realm = _a.realm, first = _a.first, taken = _a.taken, comments = _a.comments, names = _a.names, uncommitted = _a.uncommitted, onFile = _a.onFile, onMarkAgain = _a.onMarkAgain, onDone = _a.onDone, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(first), form = _b[0], setForm = _b[1];
    var _c = (0, hooks_1.useState)({}), touched = _c[0], setTouched = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    // Set once the quest is filed, so Try again only marks the comments.
    var _e = (0, hooks_1.useState)(false), isFiled = _e[0], setFiled = _e[1];
    var isSending = (0, hooks_1.useRef)(false);
    var errors = (0, design_forms_1.validateNext)(form, taken);
    var shown = Object.fromEntries(Object.entries(errors).filter(function (_a) {
        var field = _a[0];
        return touched[field];
    }));
    var set = function (patch) { return setForm(function (was) { return (__assign(__assign({}, was), patch)); }); };
    var draft = function (field, value) { return setForm(function (was) {
        var _a, _b;
        return (__assign(__assign({}, was), (_a = {}, _a[field] = value, _a.edited = __assign(__assign({}, was.edited), (_b = {}, _b[field] = true, _b)), _a)));
    }); };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var marked_1, _a, filed, marked;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setTouched({ label: true, title: true });
                    if (Object.keys(errors).length > 0 || isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    if (!isFiled) return [3 /*break*/, 2];
                    return [4 /*yield*/, onMarkAgain(form)];
                case 1:
                    marked_1 = _b.sent();
                    isSending.current = false;
                    if (marked_1.ok)
                        onDone(form);
                    else
                        setFailure(en_1.t.designs.filedButNotMarked(marked_1.message));
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, onFile(form)];
                case 3:
                    _a = _b.sent(), filed = _a.filed, marked = _a.marked;
                    isSending.current = false;
                    if (!filed.ok)
                        setFailure(filed.message);
                    else if (marked !== null && !marked.ok) {
                        setFiled(true);
                        setFailure(en_1.t.designs.filedButNotMarked(marked.message));
                    }
                    else
                        onDone(form);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={form.from === null ? en_1.t.designs.firstSheet : en_1.t.designs.nextSheet(form.from.label)} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{form.from === null ? en_1.t.designs.firstIntro(realm) : en_1.t.designs.nextIntro(realm)}</p>
      {form.from !== null && uncommitted > 0 && (<p class="note dz-uncommitted" role="status">
          {en_1.t.designs.uncommitted(form.from.label, uncommitted)}
        </p>)}
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <fieldset class="dz-plain" disabled={isFiled}>
        <field_1.Field label={en_1.t.designs.versionLabel} isRequired value={form.label} error={shown.label} onInput={function (label) { return setForm(function (was) { return (0, design_forms_1.relabel)(was, label, realm, comments, names); }); }} onBlur={function () { return setTouched(function (was) { return (__assign(__assign({}, was), { label: true })); }); }}/>
        <p class="hint">{en_1.t.designs.labelHint}</p>
        <field_1.Field label={en_1.t.designs.questTitle} isRequired value={form.title} error={shown.title} onInput={function (title) { return draft('title', title); }} onBlur={function () { return setTouched(function (was) { return (__assign(__assign({}, was), { title: true })); }); }}/>
        <field_1.Field label={en_1.t.designs.description} isLong value={form.description} onInput={function (description) { return draft('description', description); }}/>
        <field_1.Field label={en_1.t.designs.criteria} isLong value={form.criteria} onInput={function (criteria) { return draft('criteria', criteria); }}/>
        <p class="hint">{en_1.t.designs.criteriaHint}</p>
        <field_1.Group label={en_1.t.form.priority}>
          <div class="segments">
            {queue_rules_1.PRIORITY_ORDER.map(function (priority) { return (<field_1.Pick key={priority} name="priority" label={en_1.t.priority[priority]} isPicked={form.priority === priority} onPick={function () { return set({ priority: priority }); }}/>); })}
          </div>
        </field_1.Group>
      </fieldset>
      <div class="sheet-actions">
        <span class="sub">{en_1.t.designs.keys}</span>
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {isFiled ? en_1.t.failed.tryAgain : en_1.t.designs.fileQuest}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.NextVersionSheet = NextVersionSheet;
