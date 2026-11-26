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
exports.readSessions = exports.removeSessionFile = exports.writeSessionFile = void 0;
var session_rules_1 = require("../../domain/services/session_rules");
// Through a temp file, so the app never reads half a session.
var writeSessionFile = function (host, home, session) { return __awaiter(void 0, void 0, void 0, function () {
    var file, tmp, moved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = (0, session_rules_1.sessionPath)(home, session.id);
                tmp = "".concat(file, ".tmp");
                return [4 /*yield*/, host.write(tmp, JSON.stringify(session, null, 2))];
            case 1:
                _a.sent();
                return [4 /*yield*/, host.move(tmp, file)];
            case 2:
                moved = _a.sent();
                if (moved.exitCode !== 0)
                    throw new Error("mv of the session file failed: ".concat(moved.stderr));
                return [2 /*return*/];
        }
    });
}); };
exports.writeSessionFile = writeSessionFile;
var removeSessionFile = function (host, home, id) { return __awaiter(void 0, void 0, void 0, function () {
    var removed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, host.remove((0, session_rules_1.sessionPath)(home, id))];
            case 1:
                removed = _a.sent();
                if (removed.exitCode !== 0)
                    throw new Error("rm of the session file failed: ".concat(removed.stderr));
                return [2 /*return*/];
        }
    });
}); };
exports.removeSessionFile = removeSessionFile;
// Every session file that reads, fresh or not. One the session removed since
// the folder was listed is skipped: it has ended, which is what it would say.
var readSessions = function (host, home) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, sessions, _i, _a, name_1, session, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                folder = (0, session_rules_1.sessionsFolder)(home);
                sessions = [];
                _i = 0;
                return [4 /*yield*/, host.list(folder)];
            case 1:
                _a = (_d.sent()).filter(function (n) { return n.endsWith('.json'); }).sort();
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                name_1 = _a[_i];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 5, , 6]);
                _b = session_rules_1.parseSession;
                return [4 /*yield*/, host.read("".concat(folder, "/").concat(name_1))];
            case 4:
                session = _b.apply(void 0, [_d.sent()]);
                if (session !== null)
                    sessions.push(session);
                return [3 /*break*/, 6];
            case 5:
                _c = _d.sent();
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/, sessions];
        }
    });
}); };
exports.readSessions = readSessions;
