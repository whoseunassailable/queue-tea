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
exports.NoteAttachment = void 0;
var hooks_1 = require("preact/hooks");
var note_attachments_1 = require("../../../shared/note_attachments");
var engine_client_1 = require("../api/engine_client");
var states_1 = require("./states");
var en_1 = require("../../l10n/en");
var NoteAttachment = function (_a) {
    var engine = _a.engine, realm = _a.realm, path = _a.path, name = _a.name, embedded = _a.embedded;
    var _b = (0, hooks_1.useState)({ kind: 'loading' }), state = _b[0], setState = _b[1];
    var _c = (0, hooks_1.useState)(0), attempt = _c[0], setAttempt = _c[1];
    var _d = (0, hooks_1.useState)(false), isPreview = _d[0], setPreview = _d[1];
    var _e = (0, hooks_1.useState)(true), isLoading = _e[0], setLoading = _e[1];
    var _f = (0, hooks_1.useState)(false), isDownloading = _f[0], setDownloading = _f[1];
    var _g = (0, hooks_1.useState)(''), download = _g[0], setDownload = _g[1];
    (0, hooks_1.useEffect)(function () {
        var isCurrent = true;
        setState({ kind: 'loading' });
        setLoading(true);
        void (0, engine_client_1.ask)(engine, function () { return engine.readNoteFile(realm, path); }).then(function (answer) {
            if (isCurrent)
                setState(answer.ok ? { kind: 'ready', file: answer.data } : { kind: 'failed', message: answer.message });
        });
        return function () { isCurrent = false; };
    }, [realm, path, attempt]);
    var save = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDownloading(true);
                    setDownload('');
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.downloadNoteFile(realm, path); })];
                case 1:
                    answer = _a.sent();
                    setDownloading(false);
                    if (!answer.ok)
                        setDownload(answer.message);
                    else if (answer.data)
                        setDownload(en_1.t.files.downloaded);
                    return [2 /*return*/];
            }
        });
    }); };
    if (state.kind === 'loading')
        return <span class="nt-file" role="status"><states_1.Spinner /> {en_1.t.files.readingFile(name)}</span>;
    if (state.kind === 'failed')
        return <span class="nt-file" role="alert">{name}: {state.message}{' '}<button type="button" class="chip-btn" onClick={function () { return setAttempt(attempt + 1); }}>{en_1.t.failed.tryAgain}</button></span>;
    var url = (0, note_attachments_1.noteFileUrl)(realm, state.file.path);
    var isImage = state.file.kind === 'image' && embedded;
    var isPdf = state.file.kind === 'pdf';
    var previewFailed = function () {
        engine.log('error', "note preview failed: ".concat(path));
        setState({ kind: 'failed', message: en_1.t.files.previewFailed });
    };
    return <span class="nt-file">
    <span class="nt-file-actions">
      <span>{name}</span>
      {isPdf && <button type="button" class="chip-btn" aria-label={en_1.t.files.previewPdfName(name)} aria-expanded={isPreview} onClick={function () { setPreview(!isPreview); setLoading(true); }}>{isPreview ? en_1.t.files.closePreview : en_1.t.files.previewPdf}</button>}
      <button type="button" class="chip-btn" disabled={isDownloading} aria-label={en_1.t.files.downloadFile(name)} onClick={function () { return void save(); }}>{en_1.t.files.download}</button>
    </span>
    {(isDownloading || ((isImage || isPreview) && isLoading)) && <span class="nt-file-status" role="status"><states_1.Spinner /> {isDownloading ? en_1.t.files.downloading : en_1.t.files.loadingPreview}</span>}
    {isImage && <img key={attempt} class="nt-file-image" src={url} alt={name} onLoad={function () { return setLoading(false); }} onError={previewFailed}/>}
    {isPdf && isPreview && <iframe key={attempt} class="nt-file-pdf" src={"".concat(url, "#navpanes=0&view=FitH")} title={en_1.t.files.pdfTitle(name)} onLoad={function () { return setLoading(false); }} onError={previewFailed}/>}
    {download !== '' && <span class="nt-file-status" role={download === en_1.t.files.downloaded ? 'status' : 'alert'}>{download}</span>}
  </span>;
};
exports.NoteAttachment = NoteAttachment;
