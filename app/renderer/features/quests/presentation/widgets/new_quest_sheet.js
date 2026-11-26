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
exports.NewQuestSheet = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var attachment_input_1 = require("../../../../core/widgets/attachment_input");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var quest_form_1 = require("../../domain/quest_form");
var description_files_1 = require("./description_files");
var helper_toggles_1 = require("./helper_toggles");
var PRIORITIES = ['urgent', 'high', 'mid', 'okay', 'low'];
var DIFFICULTIES = ['light', 'medium', 'hard'];
var titleOfPart = function (choices, part, sagaTitle) {
    var _a, _b;
    if (part === 'new')
        return sagaTitle.trim();
    return (_b = (_a = choices.find(function (c) { return c.id === part; })) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : null;
};
var NewQuestSheet = function (_a) {
    var _b;
    var engine = _a.engine, view = _a.view, edits = _a.edits, parentId = _a.parentId, title = _a.title, onClose = _a.onClose;
    // With an active saga the answer has to be given; otherwise a quest stands
    // on its own, as it does in the terminal.
    var _c = (0, hooks_1.useState)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)(parentId !== null && parentId !== void 0 ? parentId : (view.activeSagaId === null ? 'none' : 'unset'))), { title: title !== null && title !== void 0 ? title : '' })), form = _c[0], setForm = _c[1];
    var _d = (0, hooks_1.useState)([]), touched = _d[0], setTouched = _d[1];
    var _e = (0, hooks_1.useState)({ status: 'loading' }), choices = _e[0], setChoices = _e[1];
    var _f = (0, hooks_1.useState)(null), failure = _f[0], setFailure = _f[1];
    var _g = (0, hooks_1.useState)(false), isSaving = _g[0], setSaving = _g[1];
    // A quest filed mid-upload would lose the file's link, so filing waits.
    var _h = (0, hooks_1.useState)(false), isAttaching = _h[0], setAttaching = _h[1];
    var _j = (0, hooks_1.useState)(false), isWaitShown = _j[0], setWaitShown = _j[1];
    var load = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setChoices({ status: 'loading' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readChoices(view.key, null); })];
                case 1:
                    answer = _a.sent();
                    setChoices(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    (0, hooks_1.useEffect)(function () {
        void load();
    }, []);
    var errors = (0, quest_form_1.validateQuest)(form);
    var parent = (_b = __spreadArray(__spreadArray([], view.ready, true), view.sealed, true).find(function (entry) { return entry.quest.id === parentId; })) === null || _b === void 0 ? void 0 : _b.quest;
    var parentChoices = choices.status === 'ready' ? __spreadArray(__spreadArray([], choices.data.features, true), choices.data.lone, true) : [];
    // The board can pick a quest outside the limited list of suggested parents.
    if (parent !== undefined && !parentChoices.some(function (choice) { return choice.id === parent.id; })) {
        parentChoices.unshift({ id: parent.id, title: parent.title, detail: null });
    }
    var shown = Object.fromEntries(Object.entries(errors).filter(function (_a) {
        var field = _a[0];
        return touched.includes(field);
    }));
    var set = function (patch) { return setForm(__assign(__assign({}, form), patch)); };
    var touch = function (field) { return setTouched(touched.includes(field) ? touched : __spreadArray(__spreadArray([], touched, true), [field], false)); };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var saga, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(['title', 'part', 'sagaTitle']);
                    setFailure(null);
                    setWaitShown(isAttaching);
                    if (isSaving || isAttaching || Object.keys((0, quest_form_1.validateQuest)(form)).length > 0)
                        return [2 /*return*/];
                    setSaving(true);
                    saga = titleOfPart(parentChoices, form.part, form.sagaTitle);
                    return [4 /*yield*/, edits.file(view.key, (0, quest_form_1.questOf)(form), saga)];
                case 1:
                    answer = _a.sent();
                    setSaving(false);
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.form.newTitle(view.name)} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <field_1.Field label={en_1.t.form.title} isRequired value={form.title} error={shown.title} onInput={function (title) { return set({ title: title }); }} onBlur={function () { return touch('title'); }}/>
      <field_1.Group label={en_1.t.form.priority}>
        <div class="segments">
          {PRIORITIES.map(function (priority) { return (<field_1.Pick key={priority} name="priority" label={en_1.t.priority[priority]} isPicked={form.priority === priority} onPick={function () { return set({ priority: priority }); }}/>); })}
        </div>
      </field_1.Group>
      <field_1.Group label={en_1.t.form.difficulty}>
        <div class="segments">
          {DIFFICULTIES.map(function (difficulty) { return (<field_1.Pick key={difficulty} name="difficulty" label={en_1.t.difficulty[difficulty]} isPicked={form.difficulty === difficulty} onPick={function () { return set({ difficulty: difficulty }); }}/>); })}
        </div>
      </field_1.Group>
      <field_1.Group label={en_1.t.helpers.label}>
        <helper_toggles_1.HelperToggles on={form.helpers} onChange={function (helpers) { return set({ helpers: helpers }); }}/>
      </field_1.Group>
      <field_1.Group label={"".concat(en_1.t.form.partOf).concat(view.activeSagaId === null ? '' : ' *')} error={shown.part}>
        {choices.status === 'loading' && <states_1.Loading line={en_1.t.form.loading}/>}
        {choices.status === 'failed' && <states_1.Failed message={choices.message} onRetry={function () { return void load(); }}/>}
        {choices.status === 'ready' && (<div class="picks">
            <field_1.Pick name="part" label={en_1.t.form.alone} isPicked={form.part === 'none'} onPick={function () { return set({ part: 'none' }); }}/>
            {parentChoices.map(function (choice) { return (<field_1.Pick key={choice.id} name="part" label={choice.title} detail={choice.id === view.activeSagaId ? en_1.t.form.active : choice.detail} isPicked={form.part === choice.id} onPick={function () { return set({ part: choice.id }); }}/>); })}
            <field_1.Pick name="part" label={en_1.t.form.newSaga} isPicked={form.part === 'new'} onPick={function () { return set({ part: 'new' }); }}/>
          </div>)}
      </field_1.Group>
      {form.part === 'new' && (<field_1.Field label={en_1.t.form.sagaTitle} isRequired value={form.sagaTitle} error={shown.sagaTitle} onInput={function (sagaTitle) { return set({ sagaTitle: sagaTitle }); }} onBlur={function () { return touch('sagaTitle'); }}/>)}
      <details class="form-more">
        <summary>{en_1.t.form.optional}</summary>
        <attachment_input_1.AttachmentInput engine={engine} realm={view.key} id={null} onBusy={function (busy) {
            setAttaching(busy);
            if (!busy)
                setWaitShown(false);
        }} onInsert={function (markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, setForm(function (now) { return (__assign(__assign({}, now), { description: (0, description_files_1.withFileLink)(now.description, markdown) })); })];
    }); }); }}>
          <field_1.Field label={en_1.t.form.description} isLong value={form.description} error={isAttaching && isWaitShown ? en_1.t.form.stillAttaching : undefined} onInput={function (description) { return set({ description: description }); }}/>
          <description_files_1.DescriptionFiles engine={engine} realm={view.key} text={form.description}/>
        </attachment_input_1.AttachmentInput>
        <field_1.Field label={en_1.t.form.criteria} isLong value={form.criteria} onInput={function (criteria) { return set({ criteria: criteria }); }}/>
      </details>
      <p class="hint">{en_1.t.form.waits}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.actions.add}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.NewQuestSheet = NewQuestSheet;
