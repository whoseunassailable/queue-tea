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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettings = exports.readSettings = exports.cleanSettings = exports.DEFAULT_SETTINGS = void 0;
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var accounts_1 = require("../../github/domain/accounts");
exports.DEFAULT_SETTINGS = { sky: 'auto', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} };
var SKIES = ['auto', 'morning', 'day', 'evening', 'night'];
var TERMINALS = ['terminal', 'iterm', 'vscode'];
var isSky = function (value) { return SKIES.includes(value); };
var isTerminal = function (value) { return TERMINALS.includes(value); };
var isScope = function (value) { return value === 'realm' || value === 'all'; };
var isLastProject = function (value) { return value === null || typeof value === 'string'; };
var isFolds = function (value) {
    return typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.values(value).every(function (ids) { return Array.isArray(ids) && ids.every(function (id) { return typeof id === 'string'; }); });
};
var isRealmAccounts = function (value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.values(value).every(accounts_1.isGithubLogin);
};
// What can be kept from a value read or sent: anything else stays out.
var cleanSettings = function (value) {
    var v = (typeof value === 'object' && value !== null ? value : {});
    return __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (isSky(v.sky) ? { sky: v.sky } : {})), (typeof v.isCalm === 'boolean' ? { isCalm: v.isCalm } : {})), (isLastProject(v.lastProject) ? { lastProject: v.lastProject } : {})), (isFolds(v.folds) ? { folds: v.folds } : {})), (isTerminal(v.terminal) ? { terminal: v.terminal } : {})), (isScope(v.chronicleScope) ? { chronicleScope: v.chronicleScope } : {})), (typeof v.letterKeys === 'boolean' ? { letterKeys: v.letterKeys } : {})), (isRealmAccounts(v.realmAccounts) ? { realmAccounts: v.realmAccounts } : {}));
};
exports.cleanSettings = cleanSettings;
var load = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var _c, _d, _e, _f, err_1;
    var host = _b.host, file = _b.file, log = _b.log;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, host.exists(file)];
            case 1:
                if (!(_g.sent()))
                    return [2 /*return*/, exports.DEFAULT_SETTINGS];
                _g.label = 2;
            case 2:
                _g.trys.push([2, 4, , 5]);
                _c = [__assign({}, exports.DEFAULT_SETTINGS)];
                _d = exports.cleanSettings;
                _f = (_e = JSON).parse;
                return [4 /*yield*/, host.read(file)];
            case 3: return [2 /*return*/, __assign.apply(void 0, _c.concat([_d.apply(void 0, [_f.apply(_e, [_g.sent()])])]))];
            case 4:
                err_1 = _g.sent();
                log.error('the settings file does not read, so the defaults are in use', err_1);
                return [2 /*return*/, exports.DEFAULT_SETTINGS];
            case 5: return [2 /*return*/];
        }
    });
}); };
var readSettings = function (d) { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readSettings, function () { return load(d); }); };
exports.readSettings = readSettings;
var saveSettings = function (d, patch) { return __awaiter(void 0, void 0, void 0, function () {
    var clean;
    return __generator(this, function (_a) {
        clean = (0, exports.cleanSettings)(patch);
        if (Object.keys(clean).length === 0) {
            d.log.warn('saveSettings was given nothing it could use');
            return [2 /*return*/, { ok: false, error: { message: messages_1.MESSAGES.badSetting } }];
        }
        return [2 /*return*/, (0, reply_1.reply)(d.log, messages_1.MESSAGES.saveSettings, function () { return __awaiter(void 0, void 0, void 0, function () {
                var saved, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [{}];
                            return [4 /*yield*/, load(d)];
                        case 1:
                            saved = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), clean]);
                            return [4 /*yield*/, d.host.write(d.file, JSON.stringify(saved, null, 2))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, saved];
                    }
                });
            }); })];
    });
}); };
exports.saveSettings = saveSettings;
