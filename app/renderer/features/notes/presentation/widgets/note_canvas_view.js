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
exports.NoteCanvasView = exports.canvasKeptStart = void 0;
var hooks_1 = require("preact/hooks");
var note_bookmarks_1 = require("../../../../../shared/note_bookmarks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var attachment_input_1 = require("../../../../core/widgets/attachment_input");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var note_attachment_1 = require("../../../../core/widgets/note_attachment");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var note_canvas_1 = require("../../domain/note_canvas");
var notes_view_1 = require("../../domain/notes_view");
var note_bookmark_1 = require("./note_bookmark");
var note_workspace_1 = require("./note_workspace");
var canvasKeptStart = function () { return ({ box: null, held: null }); };
exports.canvasKeptStart = canvasKeptStart;
// Sixteen hex digits, as Obsidian names cards and lines.
var newId = function () { return __spreadArray([], crypto.getRandomValues(new Uint8Array(8)), true).map(function (byte) { return byte.toString(16).padStart(2, '0'); }).join(''); };
var clampZoom = function (zoom) { return Math.min(constants_1.CANVAS_ZOOM_MAX, Math.max(constants_1.CANVAS_ZOOM_MIN, zoom)); };
var timeNow = function () { return new Date().toTimeString().slice(0, 5); };
var STEPS = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
// A press on a card's own controls works them and never drags the card.
var isControl = function (target) { return target instanceof Element && target.closest('button, a, input, iframe') !== null; };
var leafOf = function (path) { var _a; return (_a = path.split('/').at(-1)) !== null && _a !== void 0 ? _a : path; };
// Picks a note or a quest in play, as the [[ picker ranks them.
var AddCard = function (_a) {
    var notes = _a.notes, quests = _a.quests, onAdd = _a.onAdd, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(''), query = _b[0], setQuery = _b[1];
    var picks = (0, notes_view_1.linkPicksOf)(notes, quests, query, '', constants_1.NOTE_PICKER_ROWS, constants_1.NOTE_PICKER_QUEST_ROWS);
    var options = __spreadArray(__spreadArray([], picks.notes.map(function (note) { return ({ key: note.id, title: note.title, said: en_1.t.notebook.canvas.pickNote(note.title, note.folder), sub: note.folder, card: { kind: 'note', id: note.id } }); }), true), picks.quests.map(function (quest) { return ({ key: quest.id, title: quest.title, said: en_1.t.notebook.pickQuest(quest.title, en_1.t.notebook.questStateSaid[quest.state]), sub: en_1.t.notebook.questState[quest.state], card: { kind: 'quest', id: quest.id, title: quest.title } }); }), true);
    var add = function (card) {
        onAdd(card);
        onClose();
    };
    return (<dialog_1.Dialog title={en_1.t.notebook.canvas.addCardTitle} onCancel={onClose} onSubmit={function () { return options[0] !== undefined && add(options[0].card); }}>
      <div class="form-field">
        <label for="nc-find">{en_1.t.notebook.canvas.find}</label>
        <input id="nc-find" type="search" class="input" value={query} placeholder={en_1.t.notebook.canvas.findPlaceholder} autoComplete="off" onInput={function (event) { return setQuery(event.target.value); }}/>
      </div>
      {options.length === 0 ? (<p class="hint">{en_1.t.notebook.canvas.noMatch(query.trim())}</p>) : (<ul class="nc-picks">
          {options.map(function (option) { return (<li key={option.key}>
              <button type="button" class="nc-pick" aria-label={option.said} onClick={function () { return add(option.card); }}>
                <span>{option.title}</span>
                <span class="sub">{option.sub}</span>
              </button>
            </li>); })}
        </ul>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
      </div>
    </dialog_1.Dialog>);
};
var linkError = function (text) { return (text.trim() === '' ? en_1.t.notebook.canvas.linkRequired : (0, note_bookmarks_1.bookmarkUrlOf)(text) === null ? en_1.t.notebook.canvas.linkBad : undefined); };
var AddLink = function (_a) {
    var onAdd = _a.onAdd, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(''), text = _b[0], setText = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    var submit = function () {
        var found = linkError(text);
        setError(found);
        if (found !== undefined)
            return;
        onAdd({ kind: 'link', url: text.trim() });
        onClose();
    };
    return (<dialog_1.Dialog title={en_1.t.notebook.canvas.addLinkTitle} onCancel={onClose} onSubmit={submit}>
      <field_1.Field label={en_1.t.notebook.canvas.webLink} isRequired value={text} error={error} onInput={setText} onBlur={function () { return setError(linkError(text)); }}/>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.notebook.canvas.add}
        </button>
      </div>
    </dialog_1.Dialog>);
};
// The realm's board: note, quest, image and web-link cards, moved, resized
// and joined by lines. It saves itself a moment after each change, over the
// file it read; a file changed meanwhile stops the saving and asks what to keep.
var NoteCanvasView = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, realm = _a.realm, notes = _a.notes, quests = _a.quests, layout = _a.layout, kept = _a.kept, onShowList = _a.onShowList, onOpenNote = _a.onOpenNote, onOpenQuest = _a.onOpenQuest, onOpenLink = _a.onOpenLink;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readCanvas(realm); }, [realm]);
    var held = (0, hooks_1.useRef)(kept.current.held).current;
    var _e = (0, hooks_1.useState)((_b = held === null || held === void 0 ? void 0 : held.canvas) !== null && _b !== void 0 ? _b : null), canvas = _e[0], setCanvas = _e[1];
    var latest = (0, hooks_1.useRef)(canvas);
    // The board as its file holds it; null while kept edits aren't on disk.
    var onDisk = (0, hooks_1.useRef)(null);
    var stamp = (0, hooks_1.useRef)((_c = held === null || held === void 0 ? void 0 : held.stamp) !== null && _c !== void 0 ? _c : null);
    var _f = (0, hooks_1.useState)(held === null ? { kind: 'saved' } : { kind: 'dirty' }), save = _f[0], setSave = _f[1];
    var isHeld = (0, hooks_1.useRef)(false);
    var timer = (0, hooks_1.useRef)(null);
    var running = (0, hooks_1.useRef)(null);
    var _g = (0, hooks_1.useState)((_d = kept.current.box) !== null && _d !== void 0 ? _d : { zoom: 1, x: 0, y: 0 }), box = _g[0], setBox = _g[1];
    var isFitted = (0, hooks_1.useRef)(kept.current.box !== null);
    var area = (0, hooks_1.useRef)(null);
    var drag = (0, hooks_1.useRef)(null);
    var _h = (0, hooks_1.useState)(false), isDragging = _h[0], setDragging = _h[1];
    var _j = (0, hooks_1.useState)(null), connecting = _j[0], setConnecting = _j[1];
    var _k = (0, hooks_1.useState)(null), lineOn = _k[0], setLineOn = _k[1];
    var _l = (0, hooks_1.useState)(''), said = _l[0], setSaid = _l[1];
    var _m = (0, hooks_1.useState)(null), adding = _m[0], setAdding = _m[1];
    var addCardButton = (0, hooks_1.useRef)(null);
    var addLinkButton = (0, hooks_1.useRef)(null);
    var show = function (next) {
        latest.current = next;
        setCanvas(next);
    };
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
                    if (isHeld.current || sent === null)
                        return [2 /*return*/, false];
                    if (sent === onDisk.current) {
                        setSave(function (was) { return (was.kind === 'saved' ? was : { kind: 'saved' }); });
                        return [2 /*return*/, true];
                    }
                    run = (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var answer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSave({ kind: 'saving' });
                                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.saveCanvas(realm, sent, stamp.current); })];
                                case 1:
                                    answer = _a.sent();
                                    if (!answer.ok) {
                                        setSave({ kind: 'failed', message: answer.message });
                                        return [2 /*return*/, false];
                                    }
                                    if (answer.data.kind === 'changed') {
                                        isHeld.current = true;
                                        setSave({ kind: 'changed', view: answer.data.view });
                                        return [2 /*return*/, false];
                                    }
                                    stamp.current = answer.data.stamp;
                                    onDisk.current = sent;
                                    setSave(latest.current === sent ? { kind: 'saved', at: timeNow() } : { kind: 'dirty' });
                                    return [2 /*return*/, true];
                            }
                        });
                    }); })();
                    running.current = run;
                    return [4 /*yield*/, run];
                case 3:
                    isSaved = _a.sent();
                    running.current = null;
                    if (isSaved && latest.current !== onDisk.current)
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
    var change = function (next) {
        show(next);
        schedule();
    };
    var adopt = function (view) {
        latest.current = view.canvas;
        onDisk.current = view.canvas;
        stamp.current = view.stamp;
        isHeld.current = false;
        setCanvas(view.canvas);
        setSave({ kind: 'saved' });
    };
    // The first read shows; a later one (the window back in front, say) shows
    // only when nothing here is unsaved. With something unsaved, the next save asks.
    (0, hooks_1.useEffect)(function () {
        if (read.load.status !== 'ready')
            return;
        var view = read.load.data;
        if (latest.current === null || (view.stamp !== stamp.current && latest.current === onDisk.current && !isHeld.current && running.current === null))
            adopt(view);
    }, [read.load]);
    (0, hooks_1.useEffect)(function () {
        var back = function () { return read.refresh(); };
        window.addEventListener('focus', back);
        return function () { return window.removeEventListener('focus', back); };
    }, [read.refresh]);
    // Leaving the board saves what's left; what can't be saved stays with the page.
    (0, hooks_1.useEffect)(function () {
        kept.current.held = null;
        if (held !== null)
            schedule();
        var closing = function () { return void flush(); };
        window.addEventListener('beforeunload', closing);
        return function () {
            window.removeEventListener('beforeunload', closing);
            void flush().then(function (isSaved) {
                if (!isSaved && latest.current !== null && latest.current !== onDisk.current)
                    kept.current.held = { canvas: latest.current, stamp: stamp.current };
            });
        };
    }, []);
    (0, hooks_1.useEffect)(function () {
        kept.current.box = box;
    }, [box]);
    var fit = function (nodes) {
        var _a;
        var rect = (_a = area.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect === undefined || rect.width === 0)
            return;
        var bounds = (0, note_canvas_1.boundsOf)(nodes);
        if (bounds === null)
            return setBox({ zoom: 1, x: rect.width / 2, y: rect.height / 2 });
        var zoom = clampZoom(Math.min(1, (rect.width - 2 * constants_1.CANVAS_FIT_PX) / (bounds.right - bounds.left), (rect.height - 2 * constants_1.CANVAS_FIT_PX) / (bounds.bottom - bounds.top)));
        setBox({ zoom: zoom, x: rect.width / 2 - ((bounds.left + bounds.right) / 2) * zoom, y: rect.height / 2 - ((bounds.top + bounds.bottom) / 2) * zoom });
    };
    // Fitted once, when the board first shows; after that it stays where it was left.
    (0, hooks_1.useLayoutEffect)(function () {
        if (canvas === null || isFitted.current)
            return;
        isFitted.current = true;
        fit(canvas.nodes);
    }, [canvas !== null]);
    var zoomBy = function (factor, at) {
        var _a, _b, _c;
        var rect = (_a = area.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var _d = at === undefined ? [((_b = rect === null || rect === void 0 ? void 0 : rect.width) !== null && _b !== void 0 ? _b : 0) / 2, ((_c = rect === null || rect === void 0 ? void 0 : rect.height) !== null && _c !== void 0 ? _c : 0) / 2] : [at.x, at.y], px = _d[0], py = _d[1];
        setBox(function (v) {
            var zoom = clampZoom(v.zoom * factor);
            return { zoom: zoom, x: px - ((px - v.x) * zoom) / v.zoom, y: py - ((py - v.y) * zoom) / v.zoom };
        });
    };
    // A wheel pans, or zooms around the pointer with ⌘ or a pinch. It has to
    // stop the page scrolling, so it can't be a passive listener.
    var latestWheel = (0, hooks_1.useRef)(function () { });
    latestWheel.current = function (event) {
        event.preventDefault();
        if (!(event.ctrlKey || event.metaKey))
            return setBox(function (v) { return (__assign(__assign({}, v), { x: v.x - event.deltaX, y: v.y - event.deltaY })); });
        var rect = area.current.getBoundingClientRect();
        zoomBy(Math.exp(-event.deltaY * 0.01), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    (0, hooks_1.useEffect)(function () {
        var element = area.current;
        var heard = function (event) { return latestWheel.current(event); };
        element === null || element === void 0 ? void 0 : element.addEventListener('wheel', heard, { passive: false });
        return function () { return element === null || element === void 0 ? void 0 : element.removeEventListener('wheel', heard); };
    }, [canvas !== null]);
    var cardOfId = function (id) { var _a; return (_a = latest.current) === null || _a === void 0 ? void 0 : _a.nodes.find(function (node) { return node.id === id; }); };
    var nameOf = function (node) {
        var _a;
        if (node === undefined)
            return '';
        var card = (0, note_canvas_1.cardOf)(node);
        if (card.kind === 'note') {
            var note = notes.find(function (one) { return one.id === card.id; });
            return note === undefined ? en_1.t.notebook.canvas.missingCard : en_1.t.notebook.canvas.noteCard(note.title);
        }
        if (card.kind === 'quest')
            return en_1.t.notebook.canvas.questCard((_a = (0, notes_view_1.questLineOf)(quests, card.id).title) !== null && _a !== void 0 ? _a : card.shown);
        if (card.kind === 'link')
            return en_1.t.notebook.canvas.linkCard(new URL(card.url).host);
        if (card.kind === 'file')
            return en_1.t.notebook.canvas.fileCard(leafOf(card.path));
        if (card.kind === 'group')
            return en_1.t.notebook.canvas.groupCard(card.label);
        return card.kind === 'text' ? en_1.t.notebook.canvas.textCard : en_1.t.notebook.canvas.unknownCard;
    };
    var focusCard = function (id) { return requestAnimationFrame(function () { var _a; return (_a = document.getElementById("nc-card-".concat(id))) === null || _a === void 0 ? void 0 : _a.focus(); }); };
    // Where the middle of the board's window is, in the board's own units.
    var viewCentre = function () {
        var _a, _b, _c;
        var rect = (_a = area.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        return { x: (((_b = rect === null || rect === void 0 ? void 0 : rect.width) !== null && _b !== void 0 ? _b : 0) / 2 - box.x) / box.zoom, y: (((_c = rect === null || rect === void 0 ? void 0 : rect.height) !== null && _c !== void 0 ? _c : 0) / 2 - box.y) / box.zoom };
    };
    var add = function (card) {
        if (latest.current === null)
            return;
        var id = newId();
        change((0, note_canvas_1.withCard)(latest.current, id, card, viewCentre()));
        focusCard(id);
    };
    var remove = function (id) {
        var _a;
        if (latest.current === null)
            return;
        setSaid(en_1.t.notebook.canvas.removed(nameOf(cardOfId(id))));
        if (connecting === id)
            setConnecting(null);
        change((0, note_canvas_1.withoutCard)(latest.current, id));
        (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var removeLine = function (id) {
        var _a;
        if (latest.current === null)
            return;
        setLineOn(null);
        change((0, note_canvas_1.withoutLine)(latest.current, id));
        (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var join = function (fromId, toId) {
        if (latest.current === null)
            return;
        var next = (0, note_canvas_1.withLine)(latest.current, newId(), fromId, toId);
        setConnecting(null);
        if (next === latest.current)
            return setSaid(en_1.t.notebook.canvas.notConnected);
        setSaid(en_1.t.notebook.canvas.connected(nameOf(cardOfId(fromId)), nameOf(cardOfId(toId))));
        change(next);
    };
    // A note opens, as picking it in the list does; a quest only while it's in play.
    var open = function (node) {
        var card = (0, note_canvas_1.cardOf)(node);
        if (card.kind === 'note' && notes.some(function (note) { return note.id === card.id; }))
            onOpenNote(card.id);
        else if (card.kind === 'quest' && (0, notes_view_1.isInPlay)(quests, card.id))
            onOpenQuest(card.id);
        else if (card.kind === 'link')
            onOpenLink(card.url);
    };
    // A click on a card picks it, or joins it to the card waiting for a line.
    var pick = function (id) {
        if (connecting !== null)
            join(connecting, id);
        focusCard(id);
    };
    var latestMove = (0, hooks_1.useRef)(function () { });
    latestMove.current = function (event) {
        var start = drag.current;
        if (start === null || latest.current === null)
            return;
        var _a = [event.clientX - start.x, event.clientY - start.y], dx = _a[0], dy = _a[1];
        if (!start.isMoving && Math.hypot(dx, dy) <= constants_1.CANVAS_DRAG_PX)
            return;
        if (!start.isMoving) {
            start.isMoving = true;
            setDragging(true);
        }
        if (start.kind === 'pan' || start.node === null)
            return setBox(__assign(__assign({}, start.box), { x: start.box.x + dx, y: start.box.y + dy }));
        var _b = [dx / start.box.zoom, dy / start.box.zoom], wx = _b[0], wy = _b[1];
        var node = start.node;
        show((0, note_canvas_1.withPlace)(latest.current, node.id, start.kind === 'move' ? { x: node.x + wx, y: node.y + wy } : { width: node.width + wx, height: node.height + wy }));
    };
    var latestUp = (0, hooks_1.useRef)(function () { });
    latestUp.current = function () {
        var start = drag.current;
        drag.current = null;
        window.removeEventListener('mousemove', onWindowMove);
        window.removeEventListener('mouseup', onWindowUp);
        setDragging(false);
        if (start === null)
            return;
        // Moves save once, when the card is let go.
        if (start.isMoving)
            return start.kind === 'pan' ? undefined : schedule();
        if (start.node !== null)
            pick(start.node.id);
    };
    var onWindowMove = (0, hooks_1.useRef)(function (event) { return latestMove.current(event); }).current;
    var onWindowUp = (0, hooks_1.useRef)(function () { return latestUp.current(); }).current;
    (0, hooks_1.useEffect)(function () { return function () {
        window.removeEventListener('mousemove', onWindowMove);
        window.removeEventListener('mouseup', onWindowUp);
    }; }, []);
    var press = function (event, kind, node) {
        if (event.button !== 0 || drag.current !== null)
            return;
        event.stopPropagation();
        if (isControl(event.target))
            return;
        // No text selection or picture drag while dragging; the card takes focus on release.
        event.preventDefault();
        drag.current = { kind: kind, node: node, x: event.clientX, y: event.clientY, box: box, isMoving: false };
        window.addEventListener('mousemove', onWindowMove);
        window.addEventListener('mouseup', onWindowUp);
    };
    var cardKeys = function (event, id) {
        var node = cardOfId(id);
        if (event.target !== event.currentTarget || node === undefined || latest.current === null)
            return;
        var step = STEPS[event.key];
        if (step !== undefined && !event.metaKey) {
            event.preventDefault();
            var by = constants_1.CANVAS_STEP_PX * (event.shiftKey ? 4 : 1);
            change((0, note_canvas_1.withPlace)(latest.current, id, event.altKey ? { width: node.width + step.x * by, height: node.height + step.y * by } : { x: node.x + step.x * by, y: node.y + step.y * by }));
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            if (connecting === null)
                open(node);
            else
                join(connecting, id);
        }
        else if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            remove(id);
        }
    };
    var bar = (<header class="nt-head">
      {layout === 'narrow' && (<button type="button" id="nt-show-list" class="chip-btn" onClick={onShowList}>
          {en_1.t.notebook.showList}
        </button>)}
      <h2 class="nc-title">{en_1.t.notebook.canvas.title}</h2>
      {canvas !== null && <note_workspace_1.SaveLine save={save.kind === 'changed' ? { kind: 'changed', note: null } : save} onRetry={function () { return void flush(); }}/>}
    </header>);
    if (canvas === null) {
        return (<section class="nt-editor panel nc" aria-label={en_1.t.notebook.canvas.title}>
        {bar}
        {read.load.status === 'failed' ? (<div class="state" role="alert">
            <h2 class="state-title">{en_1.t.notebook.canvas.readFailed}</h2>
            <p class="state-line">{read.load.message}</p>
            <div class="nt-fail-actions">
              <button type="button" class="btn" onClick={read.retry}>
                {en_1.t.failed.tryAgain}
              </button>
              <button type="button" class="nt-link" onClick={function () { return void (0, engine_client_1.ask)(engine, function () { return engine.showNotes(realm); }); }}>
                {en_1.t.notebook.showInFinder}
              </button>
            </div>
          </div>) : (<div class="state" role="status">
            <states_1.Spinner />
            <p class="state-line">{en_1.t.notebook.canvas.reading}</p>
          </div>)}
      </section>);
    }
    var byId = new Map(canvas.nodes.map(function (node) { return [node.id, node]; }));
    var lines = canvas.edges.flatMap(function (edge) {
        var _a = [byId.get(edge.fromNode), byId.get(edge.toNode)], from = _a[0], to = _a[1];
        return from === undefined || to === undefined ? [] : [{ edge: edge, path: (0, note_canvas_1.linePathOf)(from, to, edge), said: en_1.t.notebook.canvas.line(nameOf(from), nameOf(to)) }];
    });
    var lineShown = lines.find(function (line) { return line.edge.id === lineOn; });
    // Groups sit behind the cards they hold.
    var ordered = __spreadArray(__spreadArray([], canvas.nodes.filter(function (node) { return node.type === 'group'; }), true), canvas.nodes.filter(function (node) { return node.type !== 'group'; }), true);
    var body = function (node, card) {
        var _a;
        if (card.kind === 'note') {
            var note_1 = notes.find(function (one) { return one.id === card.id; });
            if (note_1 === undefined)
                return <p class="sub">{en_1.t.notebook.canvas.missingNote}</p>;
            return (<>
          <button type="button" class="nt-link nc-card-title" aria-label={en_1.t.notebook.canvas.openNote(note_1.title)} onClick={function () { return onOpenNote(note_1.id); }}>
            {note_1.title}
          </button>
          <span class="sub">
            {note_1.folder}
            {note_1.type !== null && " \u00B7 ".concat(en_1.t.notebook.types[note_1.type])}
            {note_1.isArchived && " \u00B7 ".concat(en_1.t.notebook.canvas.archived)}
          </span>
          <p class="nc-excerpt">{note_1.body.replace(/\s+/g, ' ').trim().slice(0, constants_1.CANVAS_EXCERPT)}</p>
        </>);
        }
        if (card.kind === 'quest') {
            var line = (0, notes_view_1.questLineOf)(quests, card.id);
            return (<>
          {line.title !== null && (0, notes_view_1.isInPlay)(quests, card.id) ? (<button type="button" class="nt-link nc-card-title" aria-label={en_1.t.notebook.openQuestLink(line.title, en_1.t.notebook.questStateSaid[line.state])} onClick={function () { return onOpenQuest(card.id); }}>
              {line.title}
            </button>) : (<span class={line.title === null ? 'nc-card-title nt-broken' : 'nc-card-title'}>{(_a = line.title) !== null && _a !== void 0 ? _a : card.shown}</span>)}
          <span class="nt-quest-meta">
            <span class={"nt-state ".concat(line.state)}>{en_1.t.notebook.questState[line.state]}</span>
            {line.priority !== null && line.difficulty !== null && <span class="sub">{en_1.t.notebook.questMeta(en_1.t.priority[line.priority], en_1.t.difficulty[line.difficulty])}</span>}
          </span>
        </>);
        }
        if (card.kind === 'link')
            return <note_bookmark_1.NoteBookmark engine={engine} url={card.url} onOpenLink={onOpenLink}/>;
        if (card.kind === 'file')
            return <note_attachment_1.NoteAttachment engine={engine} realm={realm} path={card.path} name={leafOf(card.path)} embedded/>;
        if (card.kind === 'text')
            return <p class="nc-text">{card.text}</p>;
        if (card.kind === 'group')
            return null;
        return <p class="sub">{en_1.t.notebook.canvas.otherCard(card.text || node.type)}</p>;
    };
    return (<section class="nt-editor panel nc" aria-label={en_1.t.notebook.canvas.title}>
      {bar}
      {read.note !== null && (<p class="hint" role="status">
          {read.note}
        </p>)}
      {save.kind === 'changed' && (<div class="nt-banner" role="alert">
          <b>{en_1.t.notebook.canvas.changedTitle}</b>
          <span>{en_1.t.notebook.canvas.changedLine}</span>
          <span class="nt-banner-actions">
            <button type="button" class="btn primary" onClick={function () {
                stamp.current = save.view.stamp;
                onDisk.current = null;
                isHeld.current = false;
                void flush();
            }}>
              {en_1.t.notebook.keepMine}
            </button>
            <button type="button" class="btn" onClick={function () { return adopt(save.view); }}>
              {en_1.t.notebook.loadTheirs}
            </button>
          </span>
        </div>)}
      <div class="nc-tools" role="toolbar" aria-label={en_1.t.notebook.canvas.title}>
        <button ref={addCardButton} type="button" class="chip-btn" onClick={function () { return setAdding('card'); }}>
          {en_1.t.notebook.canvas.addCard}
        </button>
        <button ref={addLinkButton} type="button" class="chip-btn" onClick={function () { return setAdding('link'); }}>
          {en_1.t.notebook.canvas.addLink}
        </button>
        <span class="nc-zoom">
          <button type="button" class="chip-btn" onClick={function () { return fit(canvas.nodes); }}>
            {en_1.t.notebook.canvas.fit}
          </button>
          <button type="button" class="icon-btn" aria-label={en_1.t.notebook.canvas.zoomOut} onClick={function () { return zoomBy(1 / 1.25); }}>
            −
          </button>
          <span class="sub" aria-hidden="true">
            {Math.round(box.zoom * 100)}%
          </span>
          <button type="button" class="icon-btn" aria-label={en_1.t.notebook.canvas.zoomIn} onClick={function () { return zoomBy(1.25); }}>
            +
          </button>
        </span>
      </div>
      <attachment_input_1.AttachmentInput engine={engine} realm={realm} id={null} onFile={function (file) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, add({ kind: 'file', path: file.path })];
    }); }); }}>
        <div ref={area} class={isDragging ? 'nc-board is-dragging' : 'nc-board'} tabIndex={-1} role="region" aria-label={en_1.t.notebook.canvas.board(canvas.nodes.length, lines.length)} aria-describedby="nc-keys" onMouseDown={function (event) {
            setLineOn(null);
            press(event, 'pan', null);
        }} onKeyDown={function (event) {
            if (event.key !== 'Escape' || connecting === null)
                return;
            event.stopPropagation();
            var from = connecting;
            setConnecting(null);
            setSaid('');
            focusCard(from);
        }}>
          <div class="nc-world" style={{ transform: "translate(".concat(box.x, "px, ").concat(box.y, "px) scale(").concat(box.zoom, ")") }}>
            <svg class="nc-lines">
              <defs>
                <marker id="nc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
              </defs>
              {lines.map(function (_a) {
            var edge = _a.edge, path = _a.path, label = _a.said;
            return (<g key={edge.id} class={edge.id === lineOn ? 'nc-line on' : 'nc-line'} tabIndex={0} role="button" aria-label={label} aria-keyshortcuts="Delete" onFocus={function () { return setLineOn(edge.id); }} onMouseDown={function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.currentTarget.focus();
                }} onKeyDown={function (event) {
                    if (event.key !== 'Delete' && event.key !== 'Backspace')
                        return;
                    event.preventDefault();
                    removeLine(edge.id);
                }}>
                  <path class="nc-line-hit" d={path.d}/>
                  <path class="nc-line-stroke" d={path.d} marker-end={path.isArrowTo ? 'url(#nc-arrow)' : undefined} marker-start={path.isArrowFrom ? 'url(#nc-arrow)' : undefined}/>
                </g>);
        })}
            </svg>
            {lineShown !== undefined && (<button type="button" class="icon-btn nc-line-remove" style={{ left: "".concat(lineShown.path.mid.x, "px"), top: "".concat(lineShown.path.mid.y, "px") }} aria-label={en_1.t.notebook.canvas.removeLine} tabIndex={-1} onMouseDown={function (event) {
                event.preventDefault();
                event.stopPropagation();
            }} onClick={function () { return removeLine(lineShown.edge.id); }}>
                ✕
              </button>)}
            {ordered.map(function (node) {
            var card = (0, note_canvas_1.cardOf)(node);
            var name = nameOf(node);
            return (<div key={node.id} id={"nc-card-".concat(node.id)} class={["nc-card ".concat(card.kind), connecting === node.id && 'is-from'].filter(Boolean).join(' ')} style={{ left: "".concat(node.x, "px"), top: "".concat(node.y, "px"), width: "".concat(node.width, "px"), height: "".concat(node.height, "px") }} tabIndex={0} role="group" aria-label={name} onMouseDown={function (event) { return press(event, 'move', node); }} onKeyDown={function (event) { return cardKeys(event, node.id); }}>
                  <div class="nc-card-head">
                    {card.kind === 'group' && <span class="nc-group-label">{card.label}</span>}
                    <span class="nc-card-actions">
                      <button type="button" class="chip-btn" aria-label={en_1.t.notebook.canvas.connectLabel(name)} aria-pressed={connecting === node.id} onClick={function () {
                    setConnecting(node.id);
                    setSaid(en_1.t.notebook.canvas.connecting(name));
                }}>
                        {en_1.t.notebook.canvas.connect}
                      </button>
                      <button type="button" class="chip-btn" aria-label={en_1.t.notebook.canvas.removeLabel(name)} onClick={function () { return remove(node.id); }}>
                        {en_1.t.notebook.canvas.remove}
                      </button>
                    </span>
                  </div>
                  <div class="nc-card-body">{body(node, card)}</div>
                  <span class="nc-resize" aria-hidden="true" onMouseDown={function (event) { return press(event, 'resize', node); }}/>
                </div>);
        })}
          </div>
          {canvas.nodes.length === 0 && (<div class="nc-empty">
              <p class="state-title">{en_1.t.notebook.canvas.empty}</p>
              <p class="hint">{en_1.t.notebook.canvas.emptyLine}</p>
            </div>)}
          <p class="nc-said" role="status" aria-live="polite">
            {connecting !== null ? en_1.t.notebook.canvas.connecting(nameOf(cardOfId(connecting))) : said}
          </p>
        </div>
      </attachment_input_1.AttachmentInput>
      <p class="hint" id="nc-keys">
        {en_1.t.notebook.canvas.cardKeys}
      </p>
      {adding === 'card' && (<AddCard notes={notes} quests={quests} onAdd={add} onClose={function () {
                var _a;
                setAdding(null);
                (_a = addCardButton.current) === null || _a === void 0 ? void 0 : _a.focus();
            }}/>)}
      {adding === 'link' && (<AddLink onAdd={add} onClose={function () {
                var _a;
                setAdding(null);
                (_a = addLinkButton.current) === null || _a === void 0 ? void 0 : _a.focus();
            }}/>)}
    </section>);
};
exports.NoteCanvasView = NoteCanvasView;
