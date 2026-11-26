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
exports.AttachmentInput = void 0;
var hooks_1 = require("preact/hooks");
var note_attachments_1 = require("../../../shared/note_attachments");
var note_bookmarks_1 = require("../../../shared/note_bookmarks");
var engine_client_1 = require("../api/engine_client");
var states_1 = require("./states");
var en_1 = require("../../l10n/en");
// FileReader works in both the sandboxed window and the component tests.
var bytesOf = function (file) { return new Promise(function (done, fail) {
    var reader = new FileReader();
    reader.onload = function () { return done(new Uint8Array(reader.result)); };
    reader.onerror = function () { var _a; return fail((_a = reader.error) !== null && _a !== void 0 ? _a : new Error('reading a file failed')); };
    reader.onabort = function () { return fail(new Error('reading a file was aborted')); };
    reader.readAsArrayBuffer(file);
}); };
var AttachmentInput = function (_a) {
    var engine = _a.engine, realm = _a.realm, id = _a.id, _b = _a.isLive, isLive = _b === void 0 ? true : _b, children = _a.children, onInsert = _a.onInsert, onFile = _a.onFile, onBusy = _a.onBusy;
    var _c = (0, hooks_1.useState)({ kind: 'idle' }), state = _c[0], setState = _c[1];
    var _d = (0, hooks_1.useState)(false), isOver = _d[0], setOver = _d[1];
    var input = (0, hooks_1.useRef)(null);
    var isBusy = (0, hooks_1.useRef)(false);
    var retry = (0, hooks_1.useRef)([]);
    var attach = function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, files_1, file, error, _loop_1, state_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length === 0)
                        return [2 /*return*/];
                    setOver(false);
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        error = (0, note_attachments_1.attachmentError)(file);
                        if (error === undefined)
                            continue;
                        if (!isBusy.current)
                            retry.current = [];
                        setState({ kind: 'failed', message: error === 'type' ? en_1.t.files.fileType : en_1.t.files.fileSize });
                        return [2 /*return*/];
                    }
                    if (isBusy.current) {
                        retry.current = __spreadArray(__spreadArray([], retry.current, true), files, true);
                        return [2 /*return*/];
                    }
                    isBusy.current = true;
                    onBusy === null || onBusy === void 0 ? void 0 : onBusy(true);
                    retry.current = files;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    _loop_1 = function () {
                        var file, bytes, answer;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    file = retry.current[0];
                                    setState({ kind: 'busy', name: file.name });
                                    return [4 /*yield*/, bytesOf(file)];
                                case 1:
                                    bytes = _b.sent();
                                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.attachNoteFile(realm, id, { name: file.name, type: file.type, bytes: bytes }); })];
                                case 2:
                                    answer = _b.sent();
                                    if (!answer.ok) {
                                        setState({ kind: 'failed', message: answer.message });
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    return [4 /*yield*/, (onFile === undefined ? onInsert === null || onInsert === void 0 ? void 0 : onInsert((0, note_attachments_1.attachmentMarkdown)(answer.data, file.name)) : onFile(answer.data, file.name))
                                        // Retrying a batch starts at the failed file, keeping earlier links once.
                                    ];
                                case 3:
                                    _b.sent();
                                    // Retrying a batch starts at the failed file, keeping earlier links once.
                                    retry.current = retry.current.slice(1);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!(retry.current.length > 0)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 2];
                case 4:
                    setState({ kind: 'done' });
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _a.sent();
                    engine.log('error', "attaching a note file failed: ".concat(err_1 instanceof Error ? err_1.stack : String(err_1)));
                    setState({ kind: 'failed', message: en_1.t.files.attachFailed });
                    return [3 /*break*/, 7];
                case 6:
                    isBusy.current = false;
                    onBusy === null || onBusy === void 0 ? void 0 : onBusy(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (!isLive)
        return <>{children}</>;
    return <div class={isOver ? 'nt-dropzone over' : 'nt-dropzone'} onDragOver={function (event) {
            var _a, _b;
            if (!Array.from((_b = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) !== null && _b !== void 0 ? _b : []).includes('Files'))
                return;
            event.preventDefault();
            setOver(true);
        }} onDragLeave={function (event) { if (!event.currentTarget.contains(event.relatedTarget))
        setOver(false); }} onDrop={function (event) {
            var _a, _b;
            var files = Array.from((_b = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []);
            if (files.length === 0)
                return;
            event.preventDefault();
            event.stopPropagation();
            void attach(files);
        }} onPaste={function (event) {
            var _a, _b, _c, _d;
            var files = Array.from((_b = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []);
            if (files.length > 0) {
                event.preventDefault();
                void attach(files);
                return;
            }
            // Write pastes text as it is; a link pasted on a line of its own is a
            // bookmark already. In Read a pasted link goes in as one. A quest's
            // description has no bookmarks, so a link pasted beside it stays out.
            var url = (0, note_bookmarks_1.bookmarkUrlOf)((_d = (_c = event.clipboardData) === null || _c === void 0 ? void 0 : _c.getData('text/plain')) !== null && _d !== void 0 ? _d : '');
            if (url === null || id === null || onInsert === undefined || event.target instanceof HTMLTextAreaElement)
                return;
            event.preventDefault();
            void onInsert(url);
        }}>
    <div class="nt-attach-bar">
      <button type="button" class="chip-btn" disabled={state.kind === 'busy'} onClick={function () { var _a; return (_a = input.current) === null || _a === void 0 ? void 0 : _a.click(); }}>{en_1.t.files.attachFile}</button>
      <input ref={input} type="file" class="sr" tabIndex={-1} aria-label={en_1.t.files.attachFile} accept={note_attachments_1.NOTE_FILE_ACCEPT} multiple onChange={function (event) { var _a; var files = Array.from((_a = event.currentTarget.files) !== null && _a !== void 0 ? _a : []); event.currentTarget.value = ''; void attach(files); }}/>
      <span class="hint">{isOver ? en_1.t.files.dropFile : en_1.t.files.attachHint}</span>
    </div>
    {state.kind === 'busy' && <p class="nt-file-status" role="status"><states_1.Spinner /> {en_1.t.files.attaching(state.name)}</p>}
    {state.kind === 'done' && <p class="nt-file-status" role="status">{en_1.t.files.attached}</p>}
    {state.kind === 'failed' && <p class="field-error" role="alert">{state.message}{' '}{retry.current.length > 0 && <button type="button" class="chip-btn" onClick={function () { return void attach(retry.current); }}>{en_1.t.failed.tryAgain}</button>}</p>}
    {children}
  </div>;
};
exports.AttachmentInput = AttachmentInput;
