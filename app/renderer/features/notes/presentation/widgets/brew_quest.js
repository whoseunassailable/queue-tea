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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrewSheet = exports.BrewQuestCard = exports.Robot = void 0;
var hooks_1 = require("preact/hooks");
var notes_1 = require("../../../../../shared/notes");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var notes_view_1 = require("../../domain/notes_view");
var PRIORITIES = ['urgent', 'high', 'mid', 'okay', 'low'];
var DIFFICULTIES = ['light', 'medium', 'hard'];
// BrewQuest, drawn in pixels: a small robot with a tea-cup antenna.
var Robot = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 44 : _b;
    return (<svg class="nt-robot" viewBox="0 0 12 12" width={size} height={size} role="presentation" aria-hidden="true" shape-rendering="crispEdges">
    <rect x="5" y="0" width="2" height="1" fill="#E8B04B"/>
    <rect x="5.5" y="1" width="1" height="1" fill="#54473A"/>
    <rect x="2" y="2" width="8" height="5" fill="#EEF3F8" stroke="#2A3550" stroke-width="0.4"/>
    <rect x="3.5" y="3.5" width="1.5" height="1.5" fill="#3BA6D6"/>
    <rect x="7" y="3.5" width="1.5" height="1.5" fill="#3BA6D6"/>
    <rect x="5" y="5.6" width="2" height="0.6" fill="#2A3550"/>
    <rect x="3" y="7.5" width="6" height="3" fill="#DDE6EF" stroke="#2A3550" stroke-width="0.4"/>
    <rect x="5" y="8.3" width="2" height="1.4" fill="#2E9C7E"/>
    <rect x="1.4" y="7.8" width="1.2" height="2" fill="#B8C6D4"/>
    <rect x="9.4" y="7.8" width="1.2" height="2" fill="#B8C6D4"/>
    <rect x="3.6" y="10.6" width="1.6" height="1.2" fill="#54473A"/>
    <rect x="6.8" y="10.6" width="1.6" height="1.2" fill="#54473A"/>
  </svg>);
};
exports.Robot = Robot;
var BrewQuestCard = function (_a) {
    var line = _a.line, drag = _a.drag, onBrew = _a.onBrew;
    return (<div class="nt-brew">
    <span class="nt-brew-drag" role="img" aria-label={en_1.t.notebook.brew.drag} title={en_1.t.notebook.brew.drag} {...drag.source}>
      <exports.Robot />
    </span>
    <div class="nt-brew-text">
      <b>{en_1.t.notebook.brew.name}</b>
      <span class="sub">{line}</span>
      <span class="sub nt-brew-drag-hint">{en_1.t.notebook.brew.drag}</span>
    </div>
    <button type="button" class="btn primary" onClick={onBrew}>
      {en_1.t.notebook.brew.turn}
    </button>
  </div>);
};
exports.BrewQuestCard = BrewQuestCard;
var questTitleError = function (title) {
    if (title.trim() === '')
        return en_1.t.notebook.brew.questTitleRequired;
    if (title.trim().length > notes_1.NOTE_LIMITS.title)
        return en_1.t.notebook.brew.titleLong;
    return undefined;
};
var parentError = function (title) {
    if (title.trim() === '')
        return en_1.t.notebook.brew.parentRequired;
    if (title.trim().length > notes_1.NOTE_LIMITS.title)
        return en_1.t.notebook.brew.titleLong;
    return undefined;
};
// What BrewQuest drafted from the note, to check before anything is filed.
var BrewSheet = function (_a) {
    var engine = _a.engine, realm = _a.realm, realmName = _a.realmName, note = _a.note, quests = _a.quests, onFiled = _a.onFiled, onRefresh = _a.onRefresh, onClose = _a.onClose;
    // A parent that's done or gone takes no more quests, so new lines get a new one.
    var proposal = (0, hooks_1.useState)(function () { return (0, notes_1.proposalOf)(note, function (id) { return (0, notes_view_1.isInPlay)(quests, id); }); })[0];
    var parentsAtStart = (0, hooks_1.useState)(function () { return note.quests.filter(function (q) { return q.item === null; }).length; })[0];
    var _b = (0, hooks_1.useState)(function () { return proposal.quests.map(function (quest) { return (__assign(__assign({}, quest), { isIn: true })); }); }), rows = _b[0], setRows = _b[1];
    var _c = (0, hooks_1.useState)(proposal.parent.kind === 'new' ? proposal.parent.title : ''), parentTitle = _c[0], setParentTitle = _c[1];
    var _d = (0, hooks_1.useState)(true), isParentIn = _d[0], setParentIn = _d[1];
    var _e = (0, hooks_1.useState)({ rows: {} }), errors = _e[0], setErrors = _e[1];
    var _f = (0, hooks_1.useState)(null), failure = _f[0], setFailure = _f[1];
    var _g = (0, hooks_1.useState)(false), isFiling = _g[0], setFiling = _g[1];
    var isSending = (0, hooks_1.useRef)(false);
    var isNewParent = proposal.parent.kind === 'new';
    // Filed already, by an attempt that stopped part way: locked, and never sent again.
    var isFiled = function (row) { return note.quests.some(function (q) { return q.item === row.item; }); };
    var isParentFiled = isNewParent && note.quests.filter(function (q) { return q.item === null; }).length > parentsAtStart;
    var picked = rows.filter(function (row) { return row.isIn && !isFiled(row); });
    var isParentSent = isNewParent && isParentIn && !isParentFiled;
    var count = picked.length + (isParentSent ? 1 : 0);
    var under = proposal.parent.kind === 'task' ? (0, notes_view_1.questLineOf)(quests, proposal.parent.id).title : null;
    var ticked = (0, notes_view_1.tickedItemsOf)(note.body);
    var setRow = function (i, patch) { return setRows(function (was) { return was.map(function (row, j) { return (j === i ? __assign(__assign({}, row), patch) : row); }); }); };
    var checkRow = function (i) { return setErrors(function (was) {
        var _a;
        return (__assign(__assign({}, was), { rows: __assign(__assign({}, was.rows), (_a = {}, _a[i] = rows[i].isIn ? questTitleError(rows[i].title) : undefined, _a)) }));
    }); };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowErrors, next, sent, answer, after;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rowErrors = Object.fromEntries(rows.map(function (row, i) { return [i, row.isIn && !isFiled(row) ? questTitleError(row.title) : undefined]; }).filter(function (_a) {
                        var error = _a[1];
                        return error !== undefined;
                    }));
                    next = { rows: rowErrors, parent: isParentSent ? parentError(parentTitle) : undefined, none: picked.length === 0 ? en_1.t.notebook.brew.pickOne : undefined };
                    setErrors(next);
                    if (isSending.current || Object.keys(rowErrors).length > 0 || next.parent !== undefined || next.none !== undefined)
                        return [2 /*return*/];
                    isSending.current = true;
                    setFiling(true);
                    setFailure(null);
                    sent = {
                        // Main puts the quests under the parent the note already has, once it's in.
                        parent: isNewParent ? (isParentIn ? { kind: 'new', title: parentTitle.trim() } : { kind: 'none' }) : proposal.parent,
                        quests: picked.map(function (_a) {
                            var _ = _a.isIn, quest = __rest(_a, ["isIn"]);
                            return (__assign(__assign({}, quest), { title: quest.title.trim() }));
                        }),
                    };
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.fileNoteQuests(realm, note.id, sent); })];
                case 1:
                    answer = _c.sent();
                    isSending.current = false;
                    setFiling(false);
                    if (!answer.ok) {
                        setFailure(answer.message);
                        // Some may have gone in: read the note again, so their rows lock.
                        onRefresh();
                        return [2 /*return*/];
                    }
                    after = (_b = (_a = answer.data.view.notes.find(function (n) { return n.id === note.id; })) === null || _a === void 0 ? void 0 : _a.quests.length) !== null && _b !== void 0 ? _b : note.quests.length;
                    onFiled(answer.data, after - note.quests.length);
                    onClose();
                    return [2 /*return*/];
            }
        });
    }); };
    var total = isParentSent ? en_1.t.notebook.brew.totalWithParent(count, realmName, picked.length) : under !== null ? en_1.t.notebook.brew.totalUnder(count, realmName, under) : en_1.t.notebook.brew.total(count, realmName);
    return (<dialog_1.Dialog title={en_1.t.notebook.brew.sheet(note.title)} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <div class="nt-sheet-head">
        <exports.Robot />
        <p class="form-line">{rows.length === 0 ? en_1.t.notebook.brew.nothing : en_1.t.notebook.brew.intro}</p>
      </div>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      {rows.length > 0 && (<>
          <div class="nt-cols sub" aria-hidden="true">
            <span>{en_1.t.notebook.brew.columnTitle}</span>
            <span>{en_1.t.notebook.brew.columnPriority}</span>
            <span>{en_1.t.notebook.brew.columnDifficulty}</span>
          </div>
          {isNewParent && (<div class={isParentSent ? 'nt-row parent' : 'nt-row parent out'}>
              <input type="checkbox" checked={isParentIn || isParentFiled} disabled={isParentFiled || isFiling} aria-label={en_1.t.notebook.brew.includeParent} onChange={function (event) { return setParentIn(event.target.checked); }}/>
              <div class="nt-row-title">
                <field_1.Field label={en_1.t.notebook.brew.parent} isLabelHidden isRequired value={parentTitle} error={errors.parent} onInput={setParentTitle} onBlur={function () { return setErrors(function (was) { return (__assign(__assign({}, was), { parent: isParentSent ? parentError(parentTitle) : undefined })); }); }}/>
                <p class="hint">{isParentFiled ? en_1.t.notebook.brew.filedRow : en_1.t.notebook.brew.parentCaption}</p>
              </div>
            </div>)}
          {under !== null && <p class="hint">{en_1.t.notebook.brew.under(under)}</p>}
          <ol class={isNewParent ? 'nt-proposal under' : 'nt-proposal'}>
            {rows.map(function (row, i) {
                var line = row.item === null ? null : (0, notes_view_1.lineOf)(note.body, row.item);
                return (<li key={i} class={row.isIn && !isFiled(row) ? 'nt-row' : 'nt-row out'}>
                  <input type="checkbox" checked={row.isIn || isFiled(row)} disabled={isFiled(row) || isFiling} aria-label={en_1.t.notebook.brew.include(i + 1)} onChange={function (event) { return setRow(i, { isIn: event.target.checked }); }}/>
                  <div class="nt-row-title">
                    <field_1.Field label={en_1.t.notebook.brew.questTitle(i + 1)} isLabelHidden isRequired value={row.title} error={errors.rows[i]} onInput={function (title) { return setRow(i, { title: title }); }} onBlur={function () { return checkRow(i); }}/>
                    <p class="hint">{isFiled(row) ? en_1.t.notebook.brew.filedRow : row.item === null ? en_1.t.notebook.brew.fromNote : line === null ? '' : en_1.t.notebook.brew.fromLine(line)}</p>
                  </div>
                  <select class="chip-select" aria-label={en_1.t.notebook.brew.priority(i + 1)} value={row.priority} disabled={isFiled(row)} onChange={function (event) { return setRow(i, { priority: event.target.value }); }}>
                    {PRIORITIES.map(function (priority) { return (<option key={priority} value={priority}>
                        {en_1.t.priority[priority]}
                      </option>); })}
                  </select>
                  <select class="chip-select" aria-label={en_1.t.notebook.brew.difficulty(i + 1)} value={row.difficulty} disabled={isFiled(row)} onChange={function (event) { return setRow(i, { difficulty: event.target.value }); }}>
                    {DIFFICULTIES.map(function (difficulty) { return (<option key={difficulty} value={difficulty}>
                        {en_1.t.difficulty[difficulty]}
                      </option>); })}
                  </select>
                </li>);
            })}
          </ol>
          {ticked.length > 0 && <p class="hint">{en_1.t.notebook.brew.ticked(ticked)}</p>}
          {errors.none !== undefined && <p class="field-error">{errors.none}</p>}
          <p class="nt-total">{total}</p>
        </>)}
      <div class="sheet-actions">
        {rows.length > 0 && (<span class="sub nt-keys" aria-hidden="true">
            {en_1.t.notebook.brew.keys}
          </span>)}
        <button type="button" class="btn" onClick={onClose}>
          {rows.length === 0 ? en_1.t.notebook.brew.close : en_1.t.actions.cancel}
        </button>
        {rows.length > 0 && (<button type="submit" class="btn primary" disabled={isFiling}>
            {isFiling ? (<>
                <states_1.Spinner /> {en_1.t.notebook.brew.filing}
              </>) : failure !== null ? (en_1.t.notebook.brew.tryAgain) : (en_1.t.notebook.brew.file(count))}
          </button>)}
      </div>
    </dialog_1.Dialog>);
};
exports.BrewSheet = BrewSheet;
