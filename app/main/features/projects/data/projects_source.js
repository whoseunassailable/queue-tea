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
exports.scanRecords = exports.scanRecord = exports.keyOf = exports.isRecordName = void 0;
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var constants_1 = require("../../../core/constants");
// A record's name: `<key>.json`. The `.bak`, `.lock`, `.tmp` and `.broken-*`
// files beside it end differently, and a name starting with . is a scratch one.
var isRecordName = function (name) { return name.endsWith('.json') && !name.startsWith('.'); };
exports.isRecordName = isRecordName;
var keyOf = function (name) { return name.slice(0, -'.json'.length); };
exports.keyOf = keyOf;
// `<folder>-<6 hex>` back to the folder, for a record too broken to name itself.
var nameOf = function (key) { return key.replace(/-[0-9a-f]{6}$/, ''); };
var canRestoreFrom = function (host, file) { return __awaiter(void 0, void 0, void 0, function () {
    var bak, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                bak = (0, record_source_1.backupPath)(file);
                return [4 /*yield*/, host.exists(bak)];
            case 1:
                _a = (_c.sent());
                if (!_a) return [3 /*break*/, 3];
                _b = record_source_1.parseRecord;
                return [4 /*yield*/, host.read(bak)];
            case 2:
                _a = _b.apply(void 0, [_c.sent()]) !== 'unreadable';
                _c.label = 3;
            case 3: return [2 /*return*/, _a];
        }
    });
}); };
// One record. Whatever goes wrong stays with this project; the rest still load.
var scanRecord = function (host, folder, name, log) { return __awaiter(void 0, void 0, void 0, function () {
    var key, file, unreadable, modifiedAt, text, record, _a, reason, isNewer, _b, _c, _d, err_1;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                key = (0, exports.keyOf)(name);
                file = "".concat(folder, "/").concat(name);
                unreadable = function (reason, isNewer, canRestore, modifiedAt) { return ({
                    kind: 'unreadable',
                    key: key,
                    file: file,
                    name: nameOf(key),
                    reason: reason,
                    isNewer: isNewer,
                    canRestore: canRestore,
                    modifiedAt: modifiedAt,
                }); };
                _f.label = 1;
            case 1:
                _f.trys.push([1, 6, , 7]);
                return [4 /*yield*/, host.modifiedAt(file)];
            case 2:
                modifiedAt = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : 0;
                return [4 /*yield*/, host.read(file)];
            case 3:
                text = _f.sent();
                record = (0, record_source_1.parseRecord)(text);
                if (record !== 'unreadable')
                    return [2 /*return*/, { kind: 'readable', key: key, file: file, record: record, modifiedAt: modifiedAt }];
                log.warn("record ".concat(key, " doesn't read"));
                _a = (0, record_source_1.whyUnreadable)(text), reason = _a.reason, isNewer = _a.isNewer;
                _b = unreadable;
                _c = [reason, isNewer];
                _d = !isNewer;
                if (!_d) return [3 /*break*/, 5];
                return [4 /*yield*/, canRestoreFrom(host, file)];
            case 4:
                _d = (_f.sent());
                _f.label = 5;
            case 5: return [2 /*return*/, _b.apply(void 0, _c.concat([_d, modifiedAt]))];
            case 6:
                err_1 = _f.sent();
                log.error("reading record ".concat(key, " failed"), err_1);
                return [2 /*return*/, unreadable("it couldn't be read from disk", false, false, 0)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.scanRecord = scanRecord;
// Every record, the last changed first.
var scanRecords = function (host, home, log) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, names, scanned;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                folder = (0, constants_1.projectsFolder)(home);
                return [4 /*yield*/, host.list(folder)];
            case 1:
                names = (_a.sent()).filter(exports.isRecordName).sort();
                return [4 /*yield*/, Promise.all(names.map(function (name) { return (0, exports.scanRecord)(host, folder, name, log); }))];
            case 2:
                scanned = _a.sent();
                return [2 /*return*/, scanned.sort(function (a, b) { return b.modifiedAt - a.modifiedAt; })];
        }
    });
}); };
exports.scanRecords = scanRecords;
