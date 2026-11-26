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
exports.NotesPage = void 0;
var hooks_1 = require("preact/hooks");
var notes_1 = require("../../../../../shared/notes");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var window_width_1 = require("../../../../core/widgets/window_width");
var en_1 = require("../../../../l10n/en");
var format_1 = require("../../../../core/domain/format");
var notes_view_1 = require("../../domain/notes_view");
var notes_asks_1 = require("../state_management/notes_asks");
var brew_drag_1 = require("../state_management/brew_drag");
var brew_quest_1 = require("../widgets/brew_quest");
var notes_backup_1 = require("../widgets/notes_backup");
var note_workspace_1 = require("../widgets/note_workspace");
var note_graph_view_1 = require("../widgets/note_graph_view");
var note_canvas_view_1 = require("../widgets/note_canvas_view");
require("../notes.css");
var DeleteNote = function (_a) {
    var note = _a.note, linkedFrom = _a.linkedFrom, onDelete = _a.onDelete, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(null), failure = _b[0], setFailure = _b[1];
    var isSending = (0, hooks_1.useRef)(false);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, onDelete(note)];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.notebook.deleteTitle(note.title)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{en_1.t.notebook.deleteLine}</p>
      {linkedFrom.length > 0 && <p class="hint">{en_1.t.notebook.linkedFrom(linkedFrom)}</p>}
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.notebook.deleteIt}
        </button>
      </div>
    </dialog_1.Dialog>);
};
// Gives every note in a folder a new name. onRename says why it failed, or null.
var RenameFolder = function (_a) {
    var folder = _a.folder, onRename = _a.onRename, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(folder), name = _b[0], setName = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    var _e = (0, hooks_1.useState)(false), isSending = _e[0], setSending = _e[1];
    var check = function () {
        var found = (0, notes_view_1.folderNameError)(name);
        setError(found);
        return found === undefined;
    };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSending || !check())
                        return [2 /*return*/];
                    if (name.trim() === folder)
                        return [2 /*return*/, onClose()];
                    setSending(true);
                    return [4 /*yield*/, onRename(name.trim())];
                case 1:
                    failed = _a.sent();
                    setSending(false);
                    if (failed === null)
                        onClose();
                    else
                        setFailure(failed);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.notebook.renameTitle(folder)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{en_1.t.notebook.renameLine}</p>
      <field_1.Field label={en_1.t.notebook.folderName} isRequired value={name} error={error} onInput={setName} onBlur={check}/>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {isSending ? (<>
              <states_1.Spinner /> {en_1.t.notebook.renaming}
            </>) : (en_1.t.notebook.renameIt)}
        </button>
      </div>
    </dialog_1.Dialog>);
};
var layoutOf = function (width) { return (width < constants_1.DETAIL_IS_PAGE_BELOW ? 'narrow' : width < constants_1.DETAIL_FLOATS_BELOW ? 'mid' : 'wide'); };
// Moves focus to the note row before or after the focused one.
var stepRows = function (list, by) {
    var _a;
    var rows = __spreadArray([], list.querySelectorAll('.nt-item'), true);
    var at = rows.indexOf(document.activeElement);
    (_a = rows[Math.max(0, Math.min(rows.length - 1, at + by))]) === null || _a === void 0 ? void 0 : _a.focus();
};
// A realm's notes: the list on the left, the open note beside it. The notes
// are the realm's own, kept outside its repository; quests filed from them go
// into this realm's queue.
var NotesPage = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var engine = _a.engine, realm = _a.realm, isCovered = _a.isCovered, onProject = _a.onProject, onOpenQuest = _a.onOpenQuest, onSay = _a.onSay;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readNotes(realm.key); }, [realm.key]);
    var _h = (0, hooks_1.useState)(null), openId = _h[0], setOpenId = _h[1];
    var _j = (0, hooks_1.useState)(null), newId = _j[0], setNewId = _j[1];
    var _k = (0, hooks_1.useState)(null), brewId = _k[0], setBrewId = _k[1];
    var brewDrag = (0, brew_drag_1.useBrewDrag)(realm.key);
    var _l = (0, hooks_1.useState)(0), page = _l[0], setPage = _l[1];
    var _m = (0, hooks_1.useState)(''), query = _m[0], setQueryValue = _m[1];
    var setQuery = function (value) {
        setQueryValue(value);
        setPage(0);
    };
    var _o = (0, hooks_1.useState)(''), capture = _o[0], setCapture = _o[1];
    // Which notes the list shows: the folders, the archived ones or the journal's days.
    var _p = (0, hooks_1.useState)('notes'), shown = _p[0], setShownValue = _p[1];
    var setShown = function (value) {
        setShownValue(value);
        setPage(0);
    };
    var isArchivedView = shown === 'archived';
    var _q = (0, hooks_1.useState)(function () { return (0, notes_view_1.localDay)(new Date()); }), day = _q[0], setDay = _q[1];
    var _r = (0, hooks_1.useState)(undefined), dayFault = _r[0], setDayFault = _r[1];
    var _s = (0, hooks_1.useState)(null), failure = _s[0], setFailure = _s[1];
    var _t = (0, hooks_1.useState)(null), deleting = _t[0], setDeleting = _t[1];
    var _u = (0, hooks_1.useState)(null), renaming = _u[0], setRenaming = _u[1];
    var backup = (0, notes_backup_1.useNotesBackup)({ engine: engine, realm: realm.key, onView: read.adopt, onRefresh: read.refresh });
    var _v = (0, hooks_1.useState)(null), captureError = _v[0], setCaptureError = _v[1];
    var _w = (0, hooks_1.useState)(new Set()), folded = _w[0], setFolded = _w[1];
    var _x = (0, hooks_1.useState)(false), isDrawerOpen = _x[0], setDrawerOpen = _x[1];
    var _y = (0, hooks_1.useState)(null), showFailure = _y[0], setShowFailure = _y[1];
    // Write, Read or Graph, and the graph's settings, kept as you move between notes.
    var _z = (0, hooks_1.useState)('write'), mode = _z[0], setMode = _z[1];
    var _0 = (0, hooks_1.useState)(note_graph_view_1.GRAPH_START), graph = _0[0], setGraph = _0[1];
    // The whole realm's map, kept across notes (App remounts the page per realm).
    var kept = (0, hooks_1.useRef)((0, note_graph_view_1.keptStart)());
    // The canvas shows in place of the open note until a note is picked.
    var _1 = (0, hooks_1.useState)(false), isBoard = _1[0], setBoard = _1[1];
    var canvasKept = (0, hooks_1.useRef)((0, note_canvas_view_1.canvasKeptStart)());
    // Edits that couldn't be saved yet, by note, kept while another note is open.
    var _2 = (0, hooks_1.useState)({}), held = _2[0], setHeld = _2[1];
    var search = (0, hooks_1.useRef)(null);
    var captureBox = (0, hooks_1.useRef)(null);
    var list = (0, hooks_1.useRef)(null);
    // Which field the drawer puts the cursor in when it opens.
    var drawerFocus = (0, hooks_1.useRef)('capture');
    var saveOpen = (0, hooks_1.useRef)(null);
    var layout = layoutOf((0, window_width_1.useWindowWidth)());
    var quests = (0, hooks_1.useMemo)(function () { return (0, notes_view_1.questLinesOf)(realm); }, [realm]);
    var groups = (0, hooks_1.useMemo)(function () {
        if (read.load.status !== 'ready')
            return [];
        return shown === 'journal' ? (0, notes_view_1.journalOf)(read.load.data.notes, query) : (0, notes_view_1.foldersOf)(read.load.data.notes, query, shown === 'archived');
    }, [read.load, query, shown]);
    var where = "~/".concat(notes_1.NOTES_FOLDER, "/").concat(realm.key, "/");
    // A change's answer: the notes as they are now, or the reason it failed.
    var act = function (call, viewOf) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        read.adopt(viewOf(answer.data));
                    setFailure(answer.ok ? null : answer.message);
                    return [2 /*return*/, answer];
            }
        });
    }); };
    var create = function (input_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([input_1], args_1, true), void 0, function (input, isOpening) {
            var made;
            if (isOpening === void 0) { isOpening = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, act(function () { return engine.createNote(realm.key, input); }, function (data) { return data.view; })];
                    case 1:
                        made = _a.sent();
                        if (!made.ok)
                            return [2 /*return*/, false
                                // A new day stays in the journal; anything else shows in its folder.
                            ];
                        // A new day stays in the journal; anything else shows in its folder.
                        setShown(function (was) { return (was === 'journal' && (0, notes_view_1.isDay)(input.title) ? was : 'notes'); });
                        if (isOpening) {
                            setBoard(false);
                            setOpenId(made.data.id);
                            setNewId(made.data.id);
                            setDrawerOpen(false);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // An "Untitled" note in Inbox; main numbers it when the name is taken.
    var newNote = function () { return void create({ title: en_1.t.notebook.untitled, folder: notes_1.INBOX, body: '' }); };
    // ↩ adds the idea and stays in the line; ⌘↩ adds it and opens it.
    var jot = function (isOpening) {
        var input = (0, notes_view_1.captureOf)(capture);
        setCaptureError(input === null ? en_1.t.notebook.captureEmpty : null);
        if (input !== null)
            void create(input, isOpening).then(function (isMade) { return isMade && setCapture(''); });
    };
    var pick = function (id, isFromKeys) {
        setBoard(false);
        setOpenId(id);
        setDrawerOpen(false);
        // Picked from the keyboard, the cursor goes on to the note's text.
        if (isFromKeys)
            requestAnimationFrame(function () { var _a; return (_a = document.getElementById('nt-body')) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    // From ⇧⌘N and the palette, on any screen. A note that has gone by now
    // leaves the first one open, as a deleted note does.
    (0, notes_asks_1.useNotesAsks)(function (asked) {
        if (asked.kind === 'new')
            newNote();
        else if (asked.kind === 'open') {
            setShown('notes');
            pick(asked.id, true);
        }
        else {
            var input = (0, notes_view_1.captureOf)(asked.text);
            if (input !== null)
                void create(input, asked.isOpening);
        }
    });
    var closeDrawer = function () {
        setDrawerOpen(false);
        requestAnimationFrame(function () { var _a; return (_a = document.getElementById('nt-show-list')) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    var toggleFold = function (folder, isFolding) {
        setPage(0);
        setFolded(function (was) {
            var next = new Set(was);
            if (isFolding !== null && isFolding !== void 0 ? isFolding : !was.has(folder))
                next.add(folder);
            else
                next.delete(folder);
            return next;
        });
    };
    // Back at the window, notes edited in another app show.
    (0, hooks_1.useEffect)(function () {
        var back = function () { return read.refresh(); };
        window.addEventListener('focus', back);
        return function () { return window.removeEventListener('focus', back); };
    }, [read.refresh]);
    (0, hooks_1.useEffect)(function () {
        var _a;
        if (!isDrawerOpen)
            return;
        (_a = (drawerFocus.current === 'search' ? search : captureBox).current) === null || _a === void 0 ? void 0 : _a.focus();
        drawerFocus.current = 'capture';
    }, [isDrawerOpen]);
    (0, window_keys_1.useWindowKeys)(function (event) {
        // BrewQuest's sheet and the delete dialog are this page's own cover.
        if (isCovered || !event.metaKey || document.querySelector('[role="dialog"]') !== null)
            return;
        if (event.key !== 'f' && event.key !== 'j')
            return;
        event.preventDefault();
        var field = event.key === 'f' ? search : captureBox;
        if (field.current !== null)
            field.current.focus();
        else {
            drawerFocus.current = event.key === 'f' ? 'search' : 'capture';
            setDrawerOpen(true);
        }
    });
    var actions = {
        onSaved: read.adopt,
        onHeld: function (id, edits) { return setHeld(function (was) { return (edits === null && !(id in was) ? was : Object.fromEntries(__spreadArray(__spreadArray([], Object.entries(was).filter(function (_a) {
            var key = _a[0];
            return key !== id;
        }), true), (edits === null ? [] : [[id, edits]]), true))); }); },
        onOpen: function (id) { return setOpenId(id); },
        onMake: function (title, folder) { return void create({ title: title, folder: folder, body: '' }).then(function (isMade) { return isMade && onSay(en_1.t.notebook.made(title)); }); },
        onSaveAsNew: function (change) { return void create({ title: change.title, folder: change.folder, body: change.body, type: change.type }); },
        onRenameFolder: setRenaming,
        onArchive: function (note, isArchived) {
            return void act(function () { return engine.archiveNote(realm.key, note.id, isArchived); }, function (view) { return view; }).then(function (answer) {
                if (!answer.ok)
                    return;
                setShown('notes');
                setOpenId(isArchived ? null : note.id);
            });
        },
        onDelete: setDeleting,
        onFiled: function (filed, count) {
            read.adopt(filed.view);
            onProject(filed.project);
            onSay(en_1.t.notebook.brew.filed(count));
        },
        onOpenQuest: onOpenQuest,
        onOpenLink: function (url) { return void (0, engine_client_1.ask)(engine, function () { return engine.openLink(url); }).then(function (answer) { return !answer.ok && onSay(answer.message, 'error'); }); },
        onRefresh: read.refresh,
    };
    if (read.load.status === 'loading') {
        return (<main class="page nt">
        <div class="state panel" role="status">
          <states_1.Spinner />
          <p class="state-line">{en_1.t.loading.notes}</p>
          <p class="hint">{en_1.t.notebook.loadingWhere(where)}</p>
        </div>
      </main>);
    }
    if (read.load.status === 'failed') {
        return (<main class="page nt">
        <div class="state panel" role="alert">
          <p class="nt-fail-mark" aria-hidden="true">
            ✕
          </p>
          <h2 class="state-title">{en_1.t.notebook.failedTitle(realm.name)}</h2>
          <p class="state-line">{read.load.message}</p>
          <div class="nt-fail-actions">
            <button type="button" class="btn" onClick={read.retry}>
              {en_1.t.failed.tryAgain}
            </button>
            <button type="button" class="nt-link" onClick={function () { return void (0, engine_client_1.ask)(engine, function () { return engine.showNotes(realm.key); }).then(function (answer) { return setShowFailure(answer.ok ? null : answer.message); }); }}>
              {en_1.t.notebook.showInFinder}
            </button>
          </div>
          {showFailure !== null && <p class="field-error">{showFailure}</p>}
        </div>
      </main>);
    }
    var view = read.load.data;
    var live = view.notes.filter(function (note) { return !note.isArchived; });
    var archivedCount = view.notes.length - live.length;
    var listed = (0, notes_view_1.folderPageOf)(groups, folded, page);
    var journalCount = live.filter(function (note) { return (0, notes_view_1.isDay)(note.title); }).length;
    var first = (_c = (_b = groups.find(function (group) { return !folded.has((0, notes_view_1.folderKeyOf)(group)); })) === null || _b === void 0 ? void 0 : _b.notes[0]) !== null && _c !== void 0 ? _c : (_d = groups[0]) === null || _d === void 0 ? void 0 : _d.notes[0];
    var open = (_e = view.notes.find(function (note) { return note.id === openId; })) !== null && _e !== void 0 ? _e : first;
    var isEmpty = live.length === 0 && shown === 'notes';
    var today = (0, notes_view_1.localDay)(new Date());
    var yesterday = (0, notes_view_1.localDay)(new Date(Date.now() - 86400000));
    var folders = __spreadArray([], new Set(live.map(function (note) { return note.folder; })), true).sort();
    var pageNotes = listed.groups.flatMap(function (group) { return group.visible; });
    var focusId = pageNotes.some(function (note) { return note.id === (open === null || open === void 0 ? void 0 : open.id); }) ? open === null || open === void 0 ? void 0 : open.id : (_f = pageNotes[0]) === null || _f === void 0 ? void 0 : _f.id;
    var turnPage = function (by) {
        setPage(listed.page + by);
        requestAnimationFrame(function () {
            var _a, _b, _c;
            var target = (_b = (_a = list.current) === null || _a === void 0 ? void 0 : _a.querySelector('.nt-item')) !== null && _b !== void 0 ? _b : (_c = list.current) === null || _c === void 0 ? void 0 : _c.querySelector('.nt-fold');
            target === null || target === void 0 ? void 0 : target.focus();
            if (list.current !== null)
                list.current.scrollTop = 0;
        });
    };
    var brewOn = function (note) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = note.isArchived;
                    if (_a) return [3 /*break*/, 3];
                    _b = saveOpen.current !== null;
                    if (!_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, saveOpen.current()];
                case 1:
                    _b = !(_c.sent());
                    _c.label = 2;
                case 2:
                    _a = (_b);
                    _c.label = 3;
                case 3:
                    if (_a)
                        return [2 /*return*/];
                    setOpenId(note.id);
                    setBrewId(note.id);
                    setDrawerOpen(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // Below 900 px the list is a drawer over the note, unless there's no note.
    var isDrawer = layout === 'narrow' && (!isEmpty || isBoard);
    // A day's note opens when it's there, and starts from the daily template
    // when it isn't; either way the cursor goes to its text.
    var openDay = function (date) {
        var found = (0, notes_1.noteTitled)(view.notes, date);
        if (found !== undefined)
            return pick(found.id, true);
        void create({ title: date, folder: notes_1.JOURNAL, type: 'daily', body: (0, notes_view_1.dailyBodyOf)(view.notes, date) }).then(function (isMade) { return isMade && requestAnimationFrame(function () { var _a; return (_a = document.getElementById('nt-body')) === null || _a === void 0 ? void 0 : _a.focus(); }); });
    };
    var openPickedDay = function () {
        var fault = (0, notes_view_1.dayError)(day);
        setDayFault(fault);
        if (fault === undefined)
            openDay(day.trim());
    };
    var editDailyTemplate = function () {
        var found = (0, notes_1.noteTitled)(view.notes, notes_1.DAILY_TEMPLATE);
        if (found === undefined)
            return void create({ title: notes_1.DAILY_TEMPLATE, folder: notes_1.JOURNAL, body: en_1.t.notebook.templates.daily });
        setShown('notes');
        pick(found.id, true);
    };
    var noteList = (<nav ref={list} class={isDrawer ? 'nt-list panel drawer' : 'nt-list panel'} aria-label={en_1.t.notebook.title} onKeyDown={function (event) {
            if (event.key !== 'Escape' || !isDrawer)
                return;
            event.stopPropagation();
            closeDrawer();
        }}>
      <div class="nt-list-head">
        <h2>
          {isArchivedView ? en_1.t.notebook.archivedHeader : shown === 'journal' ? en_1.t.notebook.journalHeader : en_1.t.notebook.title}{' '}
          <span class="sub">{isArchivedView ? archivedCount : shown === 'journal' ? journalCount : live.length}</span>
        </h2>
        {!isArchivedView && (<button type="button" class="chip-btn" aria-label={en_1.t.notebook.todayNoteLabel(today)} onClick={function () { return openDay(today); }}>
            {en_1.t.notebook.todayNote}
          </button>)}
        {shown === 'notes' && (<button type="button" class="chip-btn" onClick={newNote}>
            {en_1.t.notebook.newNote}
          </button>)}
        {isDrawer && (<button type="button" class="icon-btn" aria-label={en_1.t.notebook.closeList} onClick={closeDrawer}>
            ✕
          </button>)}
      </div>
      {shown === 'journal' && (<form class="nt-day" noValidate onSubmit={function (event) {
                event.preventDefault();
                openPickedDay();
            }}>
          <label for="nt-day">
            {en_1.t.notebook.day} *
          </label>
          <div class="nt-day-row">
            <input id="nt-day" type="date" class="input" value={day} aria-invalid={dayFault === undefined ? undefined : 'true'} aria-describedby={dayFault === undefined ? 'nt-day-hint' : 'nt-day-error nt-day-hint'} onInput={function (event) { return setDay(event.target.value); }} onBlur={function () { return setDayFault((0, notes_view_1.dayError)(day)); }}/>
            <button type="submit" class="chip-btn">
              {en_1.t.notebook.openDay}
            </button>
          </div>
          {dayFault !== undefined && (<p class="field-error" id="nt-day-error">
              {dayFault}
            </p>)}
          <p class="hint" id="nt-day-hint">
            {en_1.t.notebook.dailyTemplateLine}{' '}
            <button type="button" class="nt-link" onClick={editDailyTemplate}>
              {en_1.t.notebook.editDailyTemplate}
            </button>
          </p>
        </form>)}
      {shown === 'notes' && (<form class="nt-capture" noValidate onSubmit={function (event) {
                event.preventDefault();
                jot(false);
            }}>
          <label for="nt-capture" class="sr">
            {en_1.t.notebook.capture}
          </label>
          <input ref={captureBox} id="nt-capture" class="input" value={capture} placeholder={en_1.t.notebook.capturePlaceholder} aria-invalid={captureError === null ? undefined : 'true'} aria-describedby={captureError === null ? undefined : 'nt-capture-error'} onInput={function (event) {
                setCapture(event.target.value);
                setCaptureError(null);
            }} onKeyDown={function (event) {
                if (event.key !== 'Enter' || !event.metaKey)
                    return;
                event.preventDefault();
                event.stopPropagation();
                jot(true);
            }}/>
          {captureError !== null && (<p class="field-error" id="nt-capture-error">
              {captureError}
            </p>)}
        </form>)}
      {isEmpty ? (<p class="hint">{en_1.t.notebook.captureHint}</p>) : (<>
          <label for="nt-search" class="sr">
            {en_1.t.notebook.search}
          </label>
          <input ref={search} id="nt-search" type="search" class="input" value={query} placeholder={en_1.t.notebook.searchPlaceholder} onInput={function (event) { return setQuery(event.target.value); }} onKeyDown={function (event) {
                if (event.key !== 'Escape' || query === '')
                    return;
                event.stopPropagation();
                setQuery('');
            }}/>
        </>)}
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <div class="nt-folders" onKeyDown={function (event) {
            var _a;
            var row = event.target.closest('.nt-item');
            if (row === null || list.current === null)
                return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                stepRows(list.current, event.key === 'ArrowDown' ? 1 : -1);
            }
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                toggleFold((_a = row.dataset.folder) !== null && _a !== void 0 ? _a : '', event.key === 'ArrowLeft');
            }
        }}>
        {listed.groups.map(function (group) {
            var _a;
            var key = (0, notes_view_1.folderKeyOf)(group);
            var isFolded = folded.has(key);
            var name = (_a = group.folder) !== null && _a !== void 0 ? _a : en_1.t.notebook.pinned;
            return (<section key={key} class="nt-folder" aria-label={name}>
              <h3>
                <button type="button" class="nt-fold" aria-expanded={!isFolded} onClick={function () { return toggleFold(key); }}>
                  <span aria-hidden="true">{isFolded ? '▸' : '▾'} </span>
                  {name} <span class="sub">{group.notes.length}</span>
                </button>
                {group.folder !== null && group.folder !== notes_1.INBOX && shown !== 'journal' && (<button type="button" class="nt-link nt-rename" aria-label={en_1.t.notebook.renameFolderLabel(group.folder)} onClick={function () { return setRenaming(group.folder); }}>
                    {en_1.t.notebook.rename}
                  </button>)}
              </h3>
              {!isFolded && (<ul>
                  {group.visible.map(function (note) { return (<li key={note.id}>
                      <button type="button" class={note.id === (open === null || open === void 0 ? void 0 : open.id) ? 'nt-item on' : 'nt-item'} data-folder={key} tabIndex={note.id === focusId ? 0 : -1} aria-current={note.id === (open === null || open === void 0 ? void 0 : open.id) ? 'true' : undefined} onClick={function (event) { return pick(note.id, event.detail === 0); }} {...brewDrag.target("row:".concat(note.id), !note.isArchived, function () { return void brewOn(note); })}>
                        <span class="nt-item-title">{note.title}</span>
                        <span class="sub">
                          {!note.isArchived && brewDrag.isDragging ? <span class="nt-brew-drop-hint">{en_1.t.notebook.brew.drop}</span> : <>
                            {note.id in held ? <b class="nt-unsaved">{en_1.t.notebook.notSavedRow}</b> : shown === 'journal' ? (0, format_1.dayName)(note.title) : (0, notes_view_1.whenOf)(note.updated, today, yesterday)}
                            {group.folder === null && " \u00B7 ".concat(note.folder)}
                            {note.tags.length > 0 && " \u00B7 #".concat(note.tags[0])}
                          </>}
                        </span>
                      </button>
                    </li>); })}
                </ul>)}
            </section>);
        })}
      </div>
      {listed.pages > 1 && (<div class="nt-paging">
          <span class="sub" role="status">{en_1.t.notebook.listPage(listed.page + 1, listed.pages)}</span>
          <button type="button" class="chip-btn" disabled={listed.page === 0} onClick={function () { return turnPage(-1); }}>{en_1.t.notebook.previousNotes}</button>
          <button type="button" class="chip-btn" disabled={listed.page === listed.pages - 1} onClick={function () { return turnPage(1); }}>{en_1.t.notebook.nextNotes}</button>
        </div>)}
      {groups.length === 0 && query.trim() !== '' && (<p class="hint">
          {en_1.t.notebook.noMatch(query.trim())}{' '}
          <button type="button" class="chip-btn" onClick={function () { return setQuery(''); }}>
            {en_1.t.notebook.clearSearch}
          </button>
        </p>)}
      {groups.length === 0 && query.trim() === '' && isArchivedView && <p class="hint">{en_1.t.notebook.noArchived}</p>}
      {groups.length === 0 && query.trim() === '' && shown === 'journal' && <p class="hint">{en_1.t.notebook.noJournal}</p>}
      {view.unreadable.length > 0 && (<p class="hint" role="status">
          {en_1.t.notebook.unreadable(view.unreadable)}
        </p>)}
      <div class="nt-list-foot">
        {shown === 'notes' ? (<>
            <button type="button" class="nt-link" aria-pressed="false" onClick={function () { return setShown('journal'); }}>
              {en_1.t.notebook.journal(journalCount)}
            </button>
            {archivedCount > 0 && (<button type="button" class="nt-link" aria-pressed="false" onClick={function () { return setShown('archived'); }}>
                {en_1.t.notebook.archived(archivedCount)}
              </button>)}
          </>) : (<button type="button" class="nt-link" aria-pressed="true" onClick={function () { return setShown('notes'); }}>
            {en_1.t.notebook.backToNotes}
          </button>)}
        <button type="button" class="nt-link" aria-pressed={isBoard} onClick={function () { return setBoard(!isBoard); }}>
          {en_1.t.notebook.canvas.open}
        </button>
        {backup.links}
      </div>
    </nav>);
    var empty = (<div class="state panel nt-empty">
      <brew_quest_1.Robot size={88}/>
      <h2 class="state-title">{en_1.t.notebook.emptyTitle(realm.name)}</h2>
      <p class="state-line">{en_1.t.notebook.emptyLine}</p>
      <p class="hint">{en_1.t.notebook.emptyWhere(view.folder)}</p>
      <p class="nt-empty-actions">
        <button type="button" class="btn primary" onClick={newNote}>
          {en_1.t.notebook.newNote}
        </button>
        <span class="sub">{en_1.t.notebook.newNoteKeys}</span>
      </p>
    </div>);
    return (<main class="page nt">
      {read.note !== null && (<p class="note panel" role="status">
          {read.note}
        </p>)}
      <div class={layout === 'narrow' ? 'nt-grid narrow' : 'nt-grid'}>
        {(!isDrawer || isDrawerOpen) && noteList}
        {isDrawer && isDrawerOpen && <div class="nt-scrim" aria-hidden="true" onClick={closeDrawer}/>}
        {isBoard ? (<div class="nt-main">
            <note_canvas_view_1.NoteCanvasView engine={engine} realm={realm.key} notes={view.notes} quests={quests} layout={layout} kept={canvasKept} onShowList={function () { return setDrawerOpen(true); }} onOpenNote={function (id) {
                setShown('notes');
                pick(id, false);
            }} onOpenQuest={onOpenQuest} onOpenLink={actions.onOpenLink}/>
          </div>) : isEmpty ? (empty) : open !== undefined ? (<div class="nt-main">
            <note_workspace_1.NoteWorkspace key={open.id} engine={engine} realm={realm.key} realmName={realm.name} note={open} notes={view.notes} folders={folders} quests={quests} isNew={open.id === newId} held={(_g = held[open.id]) !== null && _g !== void 0 ? _g : null} layout={layout} mode={mode} onMode={setMode} graph={graph} onGraph={setGraph} kept={kept} onShowList={function () { return setDrawerOpen(true); }} saveRef={saveOpen} actions={actions} brewDrag={brewDrag} isBrewRequested={brewId === open.id} onBrewHandled={function () { return setBrewId(null); }}/>
          </div>) : (<states_1.Empty title={en_1.t.notebook.pickTitle} line={en_1.t.notebook.pickLine}/>)}
      </div>
      {backup.dialog}
      {renaming !== null && (<RenameFolder folder={renaming} onRename={function (to) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, answer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = (open === null || open === void 0 ? void 0 : open.folder) === renaming && saveOpen.current !== null;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, saveOpen.current()];
                        case 1:
                            _a = !(_b.sent());
                            _b.label = 2;
                        case 2:
                            // The open note saves first, so moving it can't clash with its own edits.
                            if (_a)
                                return [2 /*return*/, en_1.t.notebook.openNotSaved];
                            return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.renameFolder(realm.key, renaming, to); })];
                        case 3:
                            answer = _b.sent();
                            if (!answer.ok)
                                return [2 /*return*/, answer.message];
                            read.adopt(answer.data);
                            setFolded(function (was) { return (was.has(renaming) ? new Set(__spreadArray([], was, true).filter(function (name) { return name !== renaming; }).concat(to)) : was); });
                            onSay(en_1.t.notebook.renamed(renaming, to));
                            return [2 /*return*/, null];
                    }
                });
            }); }} onClose={function () { return setRenaming(null); }}/>)}
      {deleting !== null && (<DeleteNote note={deleting} linkedFrom={(0, notes_1.backlinksOf)(view.notes, __assign(__assign({}, deleting), { isArchived: false })).map(function (n) { return n.title; })} onDelete={function (note) { return __awaiter(void 0, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.deleteNote(realm.key, note.id); })];
                        case 1:
                            answer = _a.sent();
                            if (answer.ok) {
                                read.adopt(answer.data);
                                setOpenId(null);
                            }
                            return [2 /*return*/, answer];
                    }
                });
            }); }} onClose={function () { return setDeleting(null); }}/>)}
    </main>);
};
exports.NotesPage = NotesPage;
