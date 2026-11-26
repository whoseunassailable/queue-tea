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
exports.readCodexActivity = void 0;
var DAY = 86400000;
var STAMP = /^\{"timestamp":"([^"]+)"/;
// The folder a session ran in, from its first line, Codex's session_meta.
var folderOf = function (firstLine) {
    var _a, _b;
    try {
        var cwd = (_b = (_a = JSON.parse(firstLine)) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.cwd;
        return typeof cwd === 'string' ? cwd : null;
    }
    catch (_c) {
        // A first line Codex hasn't finished writing is no session to count yet.
        return null;
    }
};
// ~/.codex/sessions/<yyyy>/<mm>/<dd>/rollout-*.jsonl, one folder per day a
// session started, one line per event, each starting with its timestamp. The
// folders are named by local date, so a day either side is read as well.
// shortcut: a session started over a day before `sinceMs` and resumed since is
// missed; read every day folder if Codex time comes up short.
var readCodexActivity = function (host, home, folder, sinceMs, nowMs) { return __awaiter(void 0, void 0, void 0, function () {
    var stamps, day, dir, _i, _a, name_1, file, _b, lines, _c, lines_1, line, ms;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                stamps = [];
                day = Math.floor((sinceMs - DAY) / DAY) * DAY;
                _h.label = 1;
            case 1:
                if (!(day <= nowMs + DAY)) return [3 /*break*/, 10];
                dir = "".concat(home, "/.codex/sessions/").concat(new Date(day).toISOString().slice(0, 10).replace(/-/g, '/'));
                return [4 /*yield*/, host.exists(dir)];
            case 2:
                if (!(_h.sent()))
                    return [3 /*break*/, 9];
                _i = 0;
                return [4 /*yield*/, host.list(dir)];
            case 3:
                _a = _h.sent();
                _h.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                name_1 = _a[_i];
                file = "".concat(dir, "/").concat(name_1);
                _b = !name_1.endsWith('.jsonl');
                if (_b) return [3 /*break*/, 6];
                return [4 /*yield*/, host.modifiedAt(file)];
            case 5:
                _b = ((_d = (_h.sent())) !== null && _d !== void 0 ? _d : 0) < sinceMs;
                _h.label = 6;
            case 6:
                if (_b)
                    return [3 /*break*/, 8];
                return [4 /*yield*/, host.read(file)];
            case 7:
                lines = (_h.sent()).split('\n');
                if (folderOf((_e = lines[0]) !== null && _e !== void 0 ? _e : '') !== folder)
                    return [3 /*break*/, 8];
                for (_c = 0, lines_1 = lines; _c < lines_1.length; _c++) {
                    line = lines_1[_c];
                    ms = Date.parse((_g = (_f = STAMP.exec(line)) === null || _f === void 0 ? void 0 : _f[1]) !== null && _g !== void 0 ? _g : '');
                    if (ms >= sinceMs)
                        stamps.push(ms);
                }
                _h.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9:
                day += DAY;
                return [3 /*break*/, 1];
            case 10: return [2 /*return*/, stamps];
        }
    });
}); };
exports.readCodexActivity = readCodexActivity;
