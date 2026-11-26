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
exports.NoteWorkspace = exports.SaveLine = void 0;
var hooks_1 = require("preact/hooks");
var note_attachments_1 = require("../../../../../shared/note_attachments");
var notes_1 = require("../../../../../shared/notes");
var engine_client_1 = require("../../../../core/api/engine_client");
var constants_1 = require("../../../../core/constants/constants");
var format_1 = require("../../../../core/domain/format");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var en_1 = require("../../../../l10n/en");
var notes_view_1 = require("../../domain/notes_view");
var brew_quest_1 = require("./brew_quest");
var read_view_1 = require("./read_view");
var note_graph_view_1 = require("./note_graph_view");
var attachment_input_1 = require("../../../../core/widgets/attachment_input");
var note_history_1 = require("./note_history");
var PICKER_WIDTH = 320;
var changeOf = function (note) { return ({ title: note.title, folder: note.folder, type: note.type, isPinned: note.isPinned, tags: note.tags, body: note.body }); };
var isSame = function (a, b) { return b !== null && a.title === b.title && a.folder === b.folder && a.type === b.type && a.isPinned === b.isPinned && a.body === b.body && a.tags.join('\n') === b.tags.join('\n'); };
// Where the caret sits in a text area, from its top-left: the text up to it is
// laid out in a hidden copy with the same box and type, and a mark measured.
var caretPoint = function (box, at) {
    var style = getComputedStyle(box);
    var copy = document.createElement('div');
    for (var _i = 0, _a = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderLeftWidth', 'boxSizing', 'width']; _i < _a.length; _i++) {
        var name_1 = _a[_i];
        copy.style[name_1] = style[name_1];
    }
    Object.assign(copy.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', top: '0', left: '0' });
    copy.textContent = box.value.slice(0, at);
    var mark = document.createElement('span');
    mark.textContent = '​';
    copy.append(mark);
    document.body.append(copy);
    var line = Number.parseFloat(style.lineHeight) || 24;
    var point = { top: box.offsetTop + mark.offsetTop - box.scrollTop + line, left: box.offsetLeft + mark.offsetLeft };
    copy.remove();
    return point;
};
var SaveLine = function (_a) {
    var save = _a.save, onRetry = _a.onRetry;
    if (save.kind === 'failed') {
        return (<p class="nt-save failed" role="alert">
        {save.message}{' '}
        <button type="button" class="chip-btn" onClick={onRetry}>
          {en_1.t.failed.tryAgain}
        </button>
      </p>);
    }
    if (save.kind === 'saving') {
        return (<p class="nt-save" role="status">
        <states_1.Spinner /> {en_1.t.notebook.saving}
      </p>);
    }
    var said = save.kind === 'saved' ? (save.at === undefined ? en_1.t.notebook.saved : save.relinked ? en_1.t.notebook.savedRelinked(save.at, save.relinked) : en_1.t.notebook.savedAt(save.at)) : save.kind === 'dirty' ? en_1.t.notebook.unsaved : en_1.t.notebook.notSavedChanged;
    return (<p class={save.kind === 'saved' ? 'nt-save saved' : 'nt-save'} role="status">
      {said}
    </p>);
};
exports.SaveLine = SaveLine;
var groupsOf = function (quests) {
    return quests.reduce(function (groups, quest) {
        if (quest.item === null)
            return __spreadArray(__spreadArray([], groups, true), [{ parent: quest, children: [] }], false);
        var last = groups.at(-1);
        if (last === undefined)
            return [{ parent: null, children: [quest] }];
        return __spreadArray(__spreadArray([], groups.slice(0, -1), true), [__assign(__assign({}, last), { children: __spreadArray(__spreadArray([], last.children, true), [quest], false) })], false);
    }, []);
};
var QuestItem = function (_a) {
    var id = _a.id, quests = _a.quests, onOpen = _a.onOpen;
    var line = (0, notes_view_1.questLineOf)(quests, id);
    return (<li class="nt-quest">
      {line.title === null ? (<span class="sub">{en_1.t.notebook.goneQuest}</span>) : !(0, notes_view_1.isInPlay)(quests, id) ? (
        // Quests can't open a done quest, so it's not a button.
        <span>{line.title}</span>) : (<button type="button" class="nt-link" aria-label={en_1.t.notebook.openQuest(line.title)} onClick={function () { return onOpen(id); }}>
          {line.title}
        </button>)}
      <span class="nt-quest-meta">
        <span class={"nt-state ".concat(line.state)}>{en_1.t.notebook.questState[line.state]}</span>
        {line.priority !== null && line.difficulty !== null && <span class="sub">{en_1.t.notebook.questMeta(en_1.t.priority[line.priority], en_1.t.difficulty[line.difficulty])}</span>}
      </span>
    </li>);
};
var QuestList = function (_a) {
    var note = _a.note, quests = _a.quests, onOpen = _a.onOpen;
    return (<ul class="nt-links">
    {groupsOf(note.quests).map(function (group) {
            return group.parent !== null && group.children.length > 0 ? (<li key={group.parent.id} class="nt-saga">
          <ul class="nt-links">
            <QuestItem id={group.parent.id} quests={quests} onOpen={onOpen}/>
          </ul>
          <span class="nt-state saga">{en_1.t.notebook.saga(group.children.filter(function (child) { return (0, notes_view_1.questLineOf)(quests, child.id).state === 'done'; }).length, group.children.length)}</span>
          <ul class="nt-links nt-under">
            {group.children.map(function (child) { return (<QuestItem key={child.id} id={child.id} quests={quests} onOpen={onOpen}/>); })}
          </ul>
        </li>) : (__spreadArray([group.parent], group.children, true).filter(function (q) { return q !== null; }).map(function (quest) { return <QuestItem key={quest.id} id={quest.id} quests={quests} onOpen={onOpen}/>; }));
        })}
  </ul>);
};
// One note, open: its editor, what it links to and from, and BrewQuest. Every
// change saves itself a moment after typing stops, over the file it was read
// from; a file changed meanwhile stops the saving and asks what to keep.
var NoteWorkspace = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, realm = _a.realm, realmName = _a.realmName, note = _a.note, notes = _a.notes, folders = _a.folders, quests = _a.quests, isNew = _a.isNew, held = _a.held, layout = _a.layout, mode = _a.mode, onMode = _a.onMode, graph = _a.graph, onGraph = _a.onGraph, kept = _a.kept, onShowList = _a.onShowList, saveRef = _a.saveRef, actions = _a.actions, brewDrag = _a.brewDrag, isBrewRequested = _a.isBrewRequested, onBrewHandled = _a.onBrewHandled;
    var start = (_b = held === null || held === void 0 ? void 0 : held.change) !== null && _b !== void 0 ? _b : changeOf(note);
    var _e = (0, hooks_1.useState)(start), draft = _e[0], setDraft = _e[1];
    var _f = (0, hooks_1.useState)(start.title), titleText = _f[0], setTitleText = _f[1];
    var _g = (0, hooks_1.useState)(start.folder), folderText = _g[0], setFolderText = _g[1];
    var _h = (0, hooks_1.useState)(start.tags.join(', ')), tagsText = _h[0], setTagsText = _h[1];
    var _j = (0, hooks_1.useState)({}), errors = _j[0], setErrors = _j[1];
    // Opened, a note says when it was last saved.
    var _k = (0, hooks_1.useState)(held === null ? { kind: 'saved', at: note.updated.slice(11, 16) } : { kind: 'dirty' }), save = _k[0], setSave = _k[1];
    var _l = (0, hooks_1.useState)(null), picker = _l[0], setPicker = _l[1];
    var _m = (0, hooks_1.useState)(false), isBrewing = _m[0], setBrewing = _m[1];
    var _o = (0, hooks_1.useState)(null), historyNote = _o[0], setHistoryNote = _o[1];
    var _p = (0, hooks_1.useState)(false), isOpeningHistory = _p[0], setOpeningHistory = _p[1];
    var _q = (0, hooks_1.useState)(false), isRestored = _q[0], setRestored = _q[1];
    var _r = (0, hooks_1.useState)(false), isDetailsOpen = _r[0], setDetailsOpen = _r[1];
    var stamp = (0, hooks_1.useRef)((_c = held === null || held === void 0 ? void 0 : held.stamp) !== null && _c !== void 0 ? _c : note.stamp);
    // Kept edits aren't on disk yet, so the first save writes them.
    var onDisk = (0, hooks_1.useRef)(held === null ? changeOf(note) : null);
    var latest = (0, hooks_1.useRef)(draft);
    latest.current = draft;
    var isHeld = (0, hooks_1.useRef)(false);
    var timer = (0, hooks_1.useRef)(null);
    var running = (0, hooks_1.useRef)(null);
    var area = (0, hooks_1.useRef)(null);
    var bodyBox = (0, hooks_1.useRef)(null);
    var titleBox = (0, hooks_1.useRef)(null);
    var detailsButton = (0, hooks_1.useRef)(null);
    var historyButton = (0, hooks_1.useRef)(null);
    var brewButton = (0, hooks_1.useRef)(null);
    var graphButton = (0, hooks_1.useRef)(null);
    var caret = (0, hooks_1.useRef)(null);
    var isLive = !note.isArchived;
    var isFloating = layout !== 'wide';
    // An archived note can't be edited, so it always reads.
    var view = isLive ? mode : 'read';
    var isShowingRead = view === 'read';
    var flush = function () { return __awaiter(void 0, void 0, void 0, function () {
        var sent, run, isSaved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (timer.current !== null)
                        clearTimeout(timer.current);
                    timer.current = null;
                    if (!(running.current !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, running.current];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    sent = latest.current;
                    if (isHeld.current)
                        return [2 /*return*/, false];
                    if (isSame(sent, onDisk.current)) {
                        setSave(function (was) { return (was.kind === 'saved' ? was : { kind: 'saved' }); });
                        return [2 /*return*/, true];
                    }
                    run = (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var answer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSave({ kind: 'saving' });
                                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.saveNote(realm, note.id, sent, stamp.current); })];
                                case 1:
                                    answer = _a.sent();
                                    if (!answer.ok) {
                                        setSave({ kind: 'failed', message: answer.message });
                                        return [2 /*return*/, false];
                                    }
                                    if (answer.data.kind === 'changed') {
                                        isHeld.current = true;
                                        setSave({ kind: 'changed', note: answer.data.note });
                                        return [2 /*return*/, false];
                                    }
                                    stamp.current = answer.data.note.stamp;
                                    onDisk.current = sent;
                                    actions.onSaved(answer.data.view);
                                    actions.onHeld(note.id, null);
                                    setSave(isSame(latest.current, sent) ? { kind: 'saved', at: answer.data.note.updated.slice(11, 16), relinked: answer.data.relinked } : { kind: 'dirty' });
                                    return [2 /*return*/, true];
                            }
                        });
                    }); })();
                    running.current = run;
                    return [4 /*yield*/, run];
                case 3:
                    isSaved = _a.sent();
                    running.current = null;
                    if (isSaved && !isSame(latest.current, onDisk.current))
                        schedule();
                    return [2 /*return*/, isSaved];
            }
        });
    }); };
    var schedule = function () {
        if (isHeld.current)
            return;
        if (timer.current !== null)
            clearTimeout(timer.current);
        setSave(function (was) { return (was.kind === 'saving' ? was : { kind: 'dirty' }); });
        timer.current = setTimeout(function () { return void flush(); }, constants_1.NOTE_AUTOSAVE_MS);
    };
    var change = function (patch) {
        setRestored(false);
        latest.current = __assign(__assign({}, latest.current), patch);
        setDraft(latest.current);
        schedule();
    };
    var adopt = function (from) {
        var next = changeOf(from);
        latest.current = next;
        onDisk.current = next;
        stamp.current = from.stamp;
        isHeld.current = false;
        setDraft(next);
        setTitleText(from.title);
        setFolderText(from.folder);
        setTagsText(from.tags.join(', '));
        setErrors({});
        setSave({ kind: 'saved', at: from.updated.slice(11, 16) });
    };
    (0, hooks_1.useEffect)(function () {
        saveRef.current = flush;
        return function () {
            saveRef.current = null;
        };
    });
    // Closing the window saves too: the save is sent before the page goes.
    (0, hooks_1.useEffect)(function () {
        var closing = function () { return void flush(); };
        window.addEventListener('beforeunload', closing);
        return function () { return window.removeEventListener('beforeunload', closing); };
    }, []);
    // Leaving the note saves what's left. What can't be saved stays with the
    // page, so opening the note again brings the edits back.
    (0, hooks_1.useEffect)(function () {
        if (held !== null)
            schedule();
        return function () {
            return void flush().then(function (isSaved) {
                if (!isSaved)
                    actions.onHeld(note.id, { change: latest.current, stamp: stamp.current });
            });
        };
    }, []);
    (0, hooks_1.useLayoutEffect)(function () {
        var _a;
        if (isNew)
            (_a = titleBox.current) === null || _a === void 0 ? void 0 : _a.select();
    }, []);
    // The file changed some other way (archived, quests filed, read again): with
    // nothing unsaved here, show it. With something unsaved, the next save asks.
    (0, hooks_1.useEffect)(function () {
        if (note.stamp !== stamp.current && save.kind === 'saved' && isSame(latest.current, onDisk.current))
            adopt(note);
    }, [note.stamp]);
    (0, hooks_1.useLayoutEffect)(function () {
        if (caret.current === null || area.current === null)
            return;
        area.current.setSelectionRange(caret.current, caret.current);
        caret.current = null;
    });
    var commitTitle = function () {
        var error = (0, notes_view_1.titleError)(titleText, notes, note.id);
        setErrors(function (was) { return (__assign(__assign({}, was), { title: error })); });
        if (error === undefined && titleText.trim() !== latest.current.title)
            change({ title: titleText.trim() });
    };
    var commitFolder = function () {
        var error = (0, notes_view_1.folderError)(folderText);
        setErrors(function (was) { return (__assign(__assign({}, was), { folder: error })); });
        if (error !== undefined)
            return;
        var folder = folderText.trim() === '' ? notes_1.INBOX : folderText.trim();
        setFolderText(folder);
        if (folder !== latest.current.folder)
            change({ folder: folder });
    };
    var commitTags = function () {
        var error = (0, notes_view_1.tagsError)(tagsText);
        setErrors(function (was) { return (__assign(__assign({}, was), { tags: error })); });
        if (error === undefined && (0, notes_view_1.tagsOf)(tagsText).join('\n') !== latest.current.tags.join('\n'))
            change({ tags: (0, notes_view_1.tagsOf)(tagsText) });
    };
    var picks = picker === null ? { notes: [], quests: [] } : (0, notes_view_1.linkPicksOf)(notes, quests, picker.query, note.id, constants_1.NOTE_PICKER_ROWS, constants_1.NOTE_PICKER_QUEST_ROWS);
    // One list, notes then quests; link is what goes after the [[.
    var options = __spreadArray(__spreadArray([], picks.notes.map(function (option) { return ({ key: option.id, link: option.title, title: option.title, folder: option.folder, state: null, label: undefined }); }), true), picks.quests.map(function (option) { return ({ key: option.id, link: (0, notes_1.questLinkOf)(option.id, option.title), title: option.title, folder: null, state: option.state, label: en_1.t.notebook.pickQuest(option.title, en_1.t.notebook.questStateSaid[option.state]) }); }), true);
    var lookAtCaret = function () {
        var _a, _b;
        var box = area.current;
        if (box === null || box.selectionStart !== box.selectionEnd)
            return setPicker(null);
        var found = (0, notes_view_1.linkQueryAt)(box.value, box.selectionStart);
        if (found === null)
            return setPicker(null);
        var point = caretPoint(box, box.selectionStart);
        // Moved left when it would run out of the editor.
        var left = Math.max(0, Math.min(point.left, ((_b = (_a = bodyBox.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : PICKER_WIDTH) - PICKER_WIDTH));
        setPicker(function (was) { return (__assign(__assign({}, found), { index: (was === null || was === void 0 ? void 0 : was.start) === found.start ? Math.min(was.index, constants_1.NOTE_PICKER_ROWS - 1) : 0, top: point.top, left: left })); });
    };
    var link = function (title) {
        var box = area.current;
        if (box === null || picker === null)
            return;
        var linked = (0, notes_view_1.withLink)(box.value, picker.start, box.selectionStart, title);
        caret.current = linked.caret;
        setPicker(null);
        change({ body: linked.body });
    };
    var pickerKeys = function (event) {
        if (picker === null)
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            setPicker(null);
        }
        else if (options.length > 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            var step = event.key === 'ArrowDown' ? 1 : options.length - 1;
            setPicker(__assign(__assign({}, picker), { index: (picker.index + step) % options.length }));
        }
        else if (options.length > 0 && (event.key === 'Enter' || event.key === 'Tab')) {
            event.preventDefault();
            link(options[Math.min(picker.index, options.length - 1)].link);
        }
    };
    // The template's text goes in, and the cursor under its first line.
    var startFrom = function (type) {
        var _a;
        var patch = (0, notes_view_1.templateChange)(type, latest.current.title, notes, note.id, (0, notes_view_1.localDay)(new Date()));
        if (patch.title !== undefined)
            setTitleText(patch.title);
        caret.current = ((_a = patch.body) !== null && _a !== void 0 ? _a : '').indexOf('\n') + 1;
        change(patch);
        requestAnimationFrame(function () { var _a; return (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    var togglePin = function () {
        change({ isPinned: !latest.current.isPinned });
        void flush();
    };
    var brew = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = isLive;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, flush()];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        setBrewing(true);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, hooks_1.useEffect)(function () {
        if (!isBrewRequested)
            return;
        onBrewHandled();
        void brew();
    }, [isBrewRequested]);
    var closeBrew = function () {
        var _a, _b;
        setBrewing(false);
        (_b = (_a = brewButton.current) === null || _a === void 0 ? void 0 : _a.querySelector('button')) === null || _b === void 0 ? void 0 : _b.focus();
    };
    var openHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isSaved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOpeningHistory(true);
                    return [4 /*yield*/, flush()];
                case 1:
                    isSaved = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(isSaved && !isSame(latest.current, onDisk.current))) return [3 /*break*/, 4];
                    return [4 /*yield*/, flush()];
                case 3:
                    isSaved = _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    if (isSaved)
                        setHistoryNote(__assign(__assign(__assign({}, note), latest.current), { stamp: stamp.current }));
                    setOpeningHistory(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var closeHistory = function () {
        var _a;
        setHistoryNote(null);
        (_a = historyButton.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var closeDetails = function () {
        var _a;
        setDetailsOpen(false);
        (_a = detailsButton.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    // Esc puts the floating inspector away, wherever the focus is; fields that
    // use Esc themselves keep it from coming here. ⌘E turns Write and Read over, ⌘G opens Graph.
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (document.querySelector('[role="dialog"]') !== null)
            return;
        if (event.key === 'Escape' && isDetailsOpen)
            closeDetails();
        else if (event.key === 'e' && event.metaKey && isLive) {
            event.preventDefault();
            setPicker(null);
            onMode(view === 'write' ? 'read' : 'write');
        }
        else if (event.key === 'g' && event.metaKey && isLive) {
            event.preventDefault();
            setPicker(null);
            onMode('graph');
        }
    });
    var shown = __assign(__assign({}, note), draft);
    var backlinks = (0, notes_1.backlinksOf)(notes, shown);
    var links = (0, notes_1.linksOf)(draft.body).filter(function (title) { return (0, note_attachments_1.noteFilePath)(title) === null || (0, notes_1.noteTitled)(notes, title) !== undefined; });
    var questLinks = (0, notes_1.questLinksOf)(draft.body);
    var today = (0, notes_view_1.localDay)(new Date());
    var yesterday = (0, notes_view_1.localDay)(new Date(Date.now() - 86400000));
    var brewLine = (0, notes_view_1.brewLineOf)(shown, (0, notes_1.proposalOf)(shown, function (id) { return (0, notes_view_1.isInPlay)(quests, id); }));
    var insertFile = function (markdown) { return __awaiter(void 0, void 0, void 0, function () {
        var body, from, to, insert, saved;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    body = latest.current.body;
                    from = (_b = (_a = area.current) === null || _a === void 0 ? void 0 : _a.selectionStart) !== null && _b !== void 0 ? _b : body.length;
                    to = (_d = (_c = area.current) === null || _c === void 0 ? void 0 : _c.selectionEnd) !== null && _d !== void 0 ? _d : from;
                    insert = "".concat(from > 0 && body[from - 1] !== '\n' ? '\n\n' : '').concat(markdown, "\n\n");
                    change({ body: body.slice(0, from) + insert + body.slice(to) });
                    caret.current = from + insert.length;
                    return [4 /*yield*/, flush()];
                case 1:
                    saved = _e.sent();
                    if (!saved)
                        actions.onHeld(note.id, { change: latest.current, stamp: stamp.current });
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div class={isFloating ? 'nt-open floats' : 'nt-open'}>
      <section class="nt-editor panel" aria-label={en_1.t.notebook.body} {...brewDrag.target('editor', isLive, function () { return void brew(); })}>
        <header class="nt-head">
          {layout === 'narrow' && (<button type="button" id="nt-show-list" class="chip-btn" onClick={onShowList}>
              {en_1.t.notebook.showList}
            </button>)}
          <span class="nt-head-folder sub">
            {isLive && brewDrag.isDragging ? <span class="nt-brew-drop-hint" role="status">{en_1.t.notebook.brew.drop}</span> : <>
              <span aria-hidden="true">▭ </span>
              {draft.folder}
              {draft.type !== null && " \u00B7 ".concat(en_1.t.notebook.types[draft.type])}
              {draft.isPinned && " \u00B7 ".concat(en_1.t.notebook.pinned)}
            </>}
          </span>
          {isLive && (<span class="nt-mode" role="group" aria-label={en_1.t.notebook.viewAs}>
              {['write', 'read', 'graph'].map(function (choice) { return (<button key={choice} ref={choice === 'graph' ? graphButton : undefined} type="button" class={view === choice ? 'nt-mode-btn on' : 'nt-mode-btn'} aria-pressed={view === choice} title={choice === 'graph' ? en_1.t.notebook.graphKeys : en_1.t.notebook.modeKeys} onClick={function () { return onMode(choice); }}>
                  {en_1.t.notebook[choice]}
                </button>); })}
            </span>)}
          <exports.SaveLine save={save} onRetry={function () { return void flush(); }}/>
          <button ref={historyButton} type="button" class="chip-btn" disabled={isOpeningHistory} onClick={function () { return void openHistory(); }}>{en_1.t.notebook.history.open}</button>
          {isFloating && (<button ref={detailsButton} type="button" class="chip-btn" aria-expanded={isDetailsOpen} aria-controls="nt-inspector" onClick={function () { return (isDetailsOpen ? closeDetails() : setDetailsOpen(true)); }}>
              {en_1.t.notebook.details}
            </button>)}
        </header>
        {isRestored && <p class="hint" role="status">{en_1.t.notebook.history.restored}</p>}
        {!isLive && <p class="nt-banner">{en_1.t.notebook.archivedLine}</p>}
        {save.kind === 'changed' && (<div class="nt-banner" role="alert">
            <b>{en_1.t.notebook.changedTitle}</b>
            <span>{save.note === null ? en_1.t.notebook.goneLine : en_1.t.notebook.changedLine}</span>
            <span class="nt-banner-actions">
              {save.note === null ? (<button type="button" class="btn primary" onClick={function () { return actions.onSaveAsNew(latest.current); }}>
                  {en_1.t.notebook.keepMine}
                </button>) : (<>
                  <button type="button" class="btn primary" onClick={function () {
                    if (save.note === null)
                        return;
                    stamp.current = save.note.stamp;
                    onDisk.current = null;
                    isHeld.current = false;
                    void flush();
                }}>
                    {en_1.t.notebook.keepMine}
                  </button>
                  <button type="button" class="btn" onClick={function () {
                    if (save.note === null)
                        return;
                    adopt(save.note);
                    actions.onRefresh();
                }}>
                    {en_1.t.notebook.loadTheirs}
                  </button>
                  <button type="button" class="btn" onClick={function () { return actions.onSaveAsNew(latest.current); }}>
                    {en_1.t.notebook.keepAsNew}
                  </button>
                </>)}
            </span>
          </div>)}
        <div class="form-field nt-title">
          <label for="nt-title" class="sr">
            {en_1.t.notebook.noteTitle} *
          </label>
          <input ref={titleBox} id="nt-title" class="input" value={titleText} readOnly={!isLive} aria-invalid={errors.title === undefined ? undefined : 'true'} aria-describedby={errors.title === undefined ? undefined : 'nt-title-error'} onInput={function (event) { return setTitleText(event.target.value); }} onBlur={commitTitle} onKeyDown={function (event) {
            var _a;
            if (event.key === 'Escape') {
                // Esc puts the saved title back.
                event.stopPropagation();
                setTitleText(latest.current.title);
                setErrors(function (was) { return (__assign(__assign({}, was), { title: undefined })); });
            }
            if (event.key !== 'Enter')
                return;
            event.preventDefault();
            (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus();
        }}/>
          {errors.title !== undefined && (<p class="field-error" id="nt-title-error">
              {errors.title}
            </p>)}
        </div>
        <attachment_input_1.AttachmentInput engine={engine} realm={realm} id={note.id} isLive={isLive} onInsert={insertFile}>
        {view === 'graph' ? (<note_graph_view_1.NoteGraphView engine={engine} notes={notes} open={shown} quests={quests} settings={graph} onSettings={onGraph} kept={kept} onOpenNote={actions.onOpen} onOpenQuest={actions.onOpenQuest} onLeave={function () { var _a; return (_a = graphButton.current) === null || _a === void 0 ? void 0 : _a.focus(); }}/>) : isShowingRead ? (<read_view_1.ReadView engine={engine} realm={realm} body={draft.body} notes={notes} quests={quests} isLive={isLive} onToggle={function (index) { return change({ body: (0, notes_view_1.toggleTaskAt)(latest.current.body, index) }); }} onOpenNote={actions.onOpen} onOpenQuest={actions.onOpenQuest} onOpenLink={actions.onOpenLink}/>) : (<div class="nt-body" ref={bodyBox}>
            <label for="nt-body" class="sr">
              {en_1.t.notebook.body}
            </label>
            <textarea ref={area} id="nt-body" class="nt-text" value={draft.body} readOnly={!isLive} placeholder={en_1.t.notebook.bodyPlaceholder} role="combobox" aria-autocomplete="list" aria-expanded={picker !== null} aria-controls="nt-picker" aria-activedescendant={picker !== null && options.length > 0 ? "nt-pick-".concat(Math.min(picker.index, options.length - 1)) : undefined} onInput={function (event) {
                change({ body: event.target.value });
                lookAtCaret();
            }} onKeyDown={pickerKeys} onClick={lookAtCaret} onKeyUp={function (event) {
                if (event.key.startsWith('Arrow') && picker === null)
                    lookAtCaret();
            }} onBlur={function () { return setPicker(null); }}/>
            {picker !== null && (<div class="nt-picker panel" style={{ top: "".concat(picker.top, "px"), left: "".concat(picker.left, "px") }}>
                <p class="nt-picker-head sub">
                  <span>{en_1.t.notebook.pickerHead(picker.query)}</span>
                  <span>{en_1.t.notebook.pickerCount(picks.notes.length, picks.quests.length)}</span>
                </p>
                <ul id="nt-picker" role="listbox" aria-label={en_1.t.notebook.linkPicker}>
                  {options.length === 0 && <li class="nt-picker-none">{en_1.t.notebook.noLinkMatch(picker.query)}</li>}
                  {options.map(function (option, i) { return (<li key={option.key} id={"nt-pick-".concat(i)} role="option" aria-selected={i === Math.min(picker.index, options.length - 1)} aria-label={option.label} class={[option.state !== null && 'quest', i === Math.min(picker.index, options.length - 1) && 'on'].filter(Boolean).join(' ') || undefined} onMouseDown={function (event) {
                        event.preventDefault();
                        link(option.link);
                    }}>
                      <span>{option.title}</span>
                      {option.state === null ? <span class="sub">{option.folder}</span> : <span class={"nt-state ".concat(option.state)}>{en_1.t.notebook.questState[option.state]}</span>}
                    </li>); })}
                </ul>
                <p class="nt-picker-keys sub" aria-hidden="true">
                  {en_1.t.notebook.pickerKeys}
                </p>
              </div>)}
          </div>)}
        </attachment_input_1.AttachmentInput>
        {isLive && view === 'write' && draft.body === '' && draft.type === null && (<div class="nt-templates" role="group" aria-label={en_1.t.notebook.templatesLabel}>
            <span class="sub">{en_1.t.notebook.templatesLabel}</span>
            {notes_1.NOTE_TYPES.map(function (type) { return (<button key={type} type="button" class="chip-btn" onClick={function () { return startFrom(type); }}>
                {en_1.t.notebook.types[type]}
              </button>); })}
          </div>)}
        {isLive && (<footer class="nt-foot" ref={brewButton}>
            <brew_quest_1.BrewQuestCard line={brewLine} drag={brewDrag} onBrew={function () { return void brew(); }}/>
          </footer>)}
      </section>
      {(!isFloating || isDetailsOpen) && (<aside id="nt-inspector" class={isFloating ? 'nt-inspector panel floating' : 'nt-inspector panel'} aria-label={en_1.t.notebook.inspector}>
          {isLive ? (<>
              <field_1.Field label={en_1.t.notebook.folder} value={folderText} error={errors.folder} list="nt-folders" onInput={setFolderText} onBlur={commitFolder} onEnter={commitFolder}/>
              {note.isPinned && note.folder !== notes_1.INBOX && !notes.some(function (other) { return !other.isArchived && !other.isPinned && other.folder === note.folder; }) && (<button type="button" class="nt-link" aria-label={en_1.t.notebook.renameFolderLabel(note.folder)} onClick={function () { return actions.onRenameFolder(note.folder); }}>
                  {en_1.t.notebook.renameIt}
                </button>)}
              <datalist id="nt-folders">
                {folders.map(function (folder) { return (<option key={folder} value={folder}/>); })}
              </datalist>
              <div class="form-field">
                <label for="nt-type">{en_1.t.notebook.type}</label>
                <select id="nt-type" class="input" value={(_d = draft.type) !== null && _d !== void 0 ? _d : ''} onChange={function (event) { return change({ type: (0, notes_1.noteTypeOf)(event.target.value) }); }}>
                  <option value="">{en_1.t.notebook.noType}</option>
                  {notes_1.NOTE_TYPES.map(function (type) { return (<option key={type} value={type}>
                      {en_1.t.notebook.types[type]}
                    </option>); })}
                </select>
              </div>
              <field_1.Field label={en_1.t.notebook.tags} value={tagsText} error={errors.tags} onInput={setTagsText} onBlur={commitTags} onEnter={commitTags}/>
              <p class="hint">{en_1.t.notebook.tagsHint}</p>
            </>) : (<p class="sub">
              {note.folder}
              {note.type !== null && " \u00B7 ".concat(en_1.t.notebook.types[note.type])}
              {note.tags.length > 0 && " \u00B7 ".concat(note.tags.map(function (tag) { return "#".concat(tag); }).join(' '))}
            </p>)}
          <h3>
            {en_1.t.notebook.quests} {note.quests.length > 0 && <span class="sub">{note.quests.length}</span>}
          </h3>
          {note.quests.length === 0 && <p class="hint">{en_1.t.notebook.noQuests}</p>}
          <QuestList note={note} quests={quests} onOpen={actions.onOpenQuest}/>
          <h3>
            {en_1.t.notebook.links} {links.length + questLinks.length > 0 && <span class="sub">{links.length + questLinks.length}</span>}
          </h3>
          {links.length + questLinks.length === 0 && <p class="hint">{en_1.t.notebook.noLinks}</p>}
          <ul class="nt-links">
            {links.map(function (title) {
                var target = (0, notes_1.noteTitled)(notes, title);
                return (<li key={title} class="nt-linked">
                  {target === undefined ? (<>
                      <span class="nt-broken">
                        <span aria-hidden="true">? </span>
                        {title}
                      </span>
                      <span class="sub">
                        <span class="sr">{en_1.t.notebook.broken(title)}</span>{' '}
                        <span aria-hidden="true">{en_1.t.notebook.noLinkWithTitle} </span>
                        {isLive && (<button type="button" class="nt-link" onClick={function () { return actions.onMake(title, draft.folder); }}>
                            {en_1.t.notebook.makeIt}
                          </button>)}
                      </span>
                    </>) : (<button type="button" class="nt-link" onClick={function () { return actions.onOpen(target.id); }}>
                      <span aria-hidden="true">▤ </span>
                      {target.title}
                    </button>)}
                </li>);
            })}
            {questLinks.map(function (id) { return (<QuestItem key={id} id={id} quests={quests} onOpen={actions.onOpenQuest}/>); })}
          </ul>
          <h3>
            {en_1.t.notebook.backlinks} {backlinks.length > 0 && <span class="sub">{backlinks.length}</span>}
          </h3>
          {backlinks.length === 0 && <p class="hint">{en_1.t.notebook.noBacklinks}</p>}
          <ul class="nt-links">
            {backlinks.map(function (other) { return (<li key={other.id} class="nt-linked">
                <button type="button" class="nt-link" onClick={function () { return actions.onOpen(other.id); }}>
                  <span aria-hidden="true">↳ </span>
                  {other.title}
                </button>
                {(0, notes_view_1.linkLineOf)(other.body, shown.title) !== null && <span class="sub nt-excerpt">{(0, notes_view_1.linkLineOf)(other.body, shown.title)}</span>}
              </li>); })}
          </ul>
          <div class="nt-inspector-foot">
            <p class="sub">{en_1.t.notebook.dates((0, format_1.dayOf)(note.created), (0, notes_view_1.whenOf)(note.updated, today, yesterday))}</p>
            <div class="nt-inspector-actions">
              {isLive ? (<>
                  <button type="button" class="btn" onClick={togglePin}>
                    {draft.isPinned ? en_1.t.notebook.unpin : en_1.t.notebook.pin}
                  </button>
                  <button type="button" class="btn" onClick={function () { return void flush().then(function (isSaved) { return isSaved && actions.onArchive(note, true); }); }}>
                    {en_1.t.notebook.archiveNote}
                  </button>
                </>) : (<>
                  <button type="button" class="btn" onClick={function () { return actions.onArchive(note, false); }}>
                    {en_1.t.notebook.restore}
                  </button>
                  <button type="button" class="btn" onClick={function () { return actions.onDelete(note); }}>
                    {en_1.t.notebook.deleteForever}
                  </button>
                </>)}
            </div>
          </div>
        </aside>)}
      {isBrewing && <brew_quest_1.BrewSheet engine={engine} realm={realm} realmName={realmName} note={shown} quests={quests} onFiled={actions.onFiled} onRefresh={actions.onRefresh} onClose={closeBrew}/>}
      {historyNote !== null && <note_history_1.NoteHistory engine={engine} realm={realm} note={historyNote} onClose={closeHistory} onRefresh={actions.onRefresh} onRestored={function (saved) {
                adopt(saved.note);
                actions.onSaved(saved.view);
                actions.onHeld(note.id, null);
                setRestored(true);
                closeHistory();
            }}/>}
    </div>);
};
exports.NoteWorkspace = NoteWorkspace;
