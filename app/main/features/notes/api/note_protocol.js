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
exports.noteFileResponse = void 0;
var note_attachments_1 = require("../../../../shared/note_attachments");
// Never hand an arbitrary file URL to Chromium. The same realm and path
// checks protect both the metadata IPC and every request for preview bytes.
var noteFileResponse = function (url, notes) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, _a, key, parts, answer, file;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                try {
                    parsed = new URL(url);
                }
                catch (_c) {
                    // A malformed URL has no file to serve.
                    return [2 /*return*/, new Response(null, { status: 400 })];
                }
                if (parsed.protocol !== "".concat(note_attachments_1.NOTE_FILE_SCHEME, ":") || parsed.hostname !== 'realm' || parsed.port !== '' || parsed.username !== '' || parsed.password !== '' || parsed.search !== '')
                    return [2 /*return*/, new Response(null, { status: 400 })];
                _a = parsed.pathname.split('/'), key = _a[1], parts = _a.slice(2);
                return [4 /*yield*/, notes.serveNoteFile(key, parts.join('/'))];
            case 1:
                answer = _b.sent();
                if (!answer.ok)
                    return [2 /*return*/, new Response(null, { status: 404 })];
                file = answer.data;
                // Other files can be downloaded through IPC; they never become a document
                // in a frame. SVG is passive in an img and gets a sandbox if navigated to.
                if (file.kind === 'other')
                    return [2 /*return*/, new Response(null, { status: 415 })];
                return [2 /*return*/, new Response(new Uint8Array(file.bytes), { headers: {
                            'Content-Type': file.mime,
                            'Content-Length': String(file.bytes.length),
                            'X-Content-Type-Options': 'nosniff',
                            'Cache-Control': 'no-store',
                            'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                        } })];
        }
    });
}); };
exports.noteFileResponse = noteFileResponse;
