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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.readOthers = exports.updateRecord = exports.readRecord = exports.restoreRecord = exports.readProblem = exports.whyUnreadable = exports.backupPath = exports.parseRecord = exports.emptyRecord = exports.carryOverRecords = exports.recordPath = exports.projectKey = void 0;
var host_1 = require("../../../../core/host/host");
var activity_1 = require("../../../activity/domain/services/activity");
var realm_time_1 = require("../../../time/domain/services/realm_time");
var helpers_1 = require("../../domain/services/helpers");
var test_profile_1 = require("../../domain/services/test_profile");
var record_text_1 = require("../../domain/constants/record_text");
// FNV-1a, 32 bits: a short, stable code for a path.
var fnv1a = function (text) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
};
// `<folder>-<6 hex>`, so two repositories with the same folder name differ.
var projectKey = function (path) {
    var trimmed = path.replace(/\/+$/, '');
    var folder = trimmed.split('/').pop() || 'project';
    return "".concat(folder, "-").concat(fnv1a(trimmed).slice(0, 6));
};
exports.projectKey = projectKey;
var recordPath = function (home, key) {
    return "".concat(home, "/.queue-tea/projects/").concat(key, ".json");
};
exports.recordPath = recordPath;
// Before the mod was Queue-tea its records were in ~/.queue-tie. The first
// start without ~/.queue-tea copies them over; the old folder is left as it was.
var carryOverRecords = function (host, home) { return __awaiter(void 0, void 0, void 0, function () {
    var from, to, _a, _b, _i, _c, argv, ran;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                from = "".concat(home, "/.queue-tie/projects");
                to = "".concat(home, "/.queue-tea/projects");
                _b = home === '';
                if (_b) return [3 /*break*/, 2];
                return [4 /*yield*/, host.exists(to)];
            case 1:
                _b = (_d.sent());
                _d.label = 2;
            case 2:
                _a = _b;
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, host.exists(from)];
            case 3:
                _a = !(_d.sent());
                _d.label = 4;
            case 4:
                if (_a)
                    return [2 /*return*/, 'none'];
                _i = 0, _c = [['mkdir', '-p', "".concat(home, "/.queue-tea")], ['cp', '-Rp', from, to]];
                _d.label = 5;
            case 5:
                if (!(_i < _c.length)) return [3 /*break*/, 8];
                argv = _c[_i];
                return [4 /*yield*/, host.run(argv)];
            case 6:
                ran = _d.sent();
                if (ran.exitCode !== 0)
                    throw new Error("".concat(argv[0], " of the old records failed: ").concat(ran.stderr));
                _d.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/, 'copied'];
        }
    });
}); };
exports.carryOverRecords = carryOverRecords;
var emptyRecord = function (name, path) { return ({
    version: 2,
    project: { name: name, path: path },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [],
    unassignedMinutesByDay: {},
    requests: [],
}); };
exports.emptyRecord = emptyRecord;
var withDefaults = function (_a) {
    var _b, _c, _d, _e;
    var testProfile = _a.testProfile, testPeriods = _a.testPeriods, minutesInChecks = _a.minutesInChecks, due = _a.due, activity = _a.activity, step = _a.step, waiting = _a.waiting, t = __rest(_a, ["testProfile", "testPeriods", "minutesInChecks", "due", "activity", "step", "waiting"]);
    var profile = (0, test_profile_1.readTestProfile)(testProfile);
    var old = (0, activity_1.fromOldLog)(activity);
    var now = (_b = (0, activity_1.stepOf)(step)) !== null && _b !== void 0 ? _b : old.step;
    var waits = waiting === undefined ? (_c = old.waiting) !== null && _c !== void 0 ? _c : [] : (0, activity_1.waitingOf)(waiting);
    return __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ id: "t-".concat(fnv1a("".concat((_d = t.created) !== null && _d !== void 0 ? _d : '', "|").concat((_e = t.title) !== null && _e !== void 0 ? _e : ''))), baseBranch: null, blockedBy: [], blockedReason: null, checkpoint: null, parentId: null, description: null, criteria: [], review: null, codexSince: null, worktreePath: null }, t), { helpers: (0, helpers_1.readHelpers)(t.helpers) }), (profile === undefined ? {} : { testProfile: profile })), (arePeriods(testPeriods) ? { testPeriods: (0, realm_time_1.mergePeriods)(testPeriods) } : {})), (typeof minutesInChecks === 'number' && Number.isFinite(minutesInChecks) && minutesInChecks >= 0 ? { minutesInChecks: minutesInChecks } : {})), (typeof due === 'string' && isDay(due) ? { due: due } : {})), (now === null || now === undefined ? {} : { step: now })), (waits.length === 0 ? {} : { waiting: waits }));
};
var isObject = function (value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
};
var isDay = function (day) {
    return /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse("".concat(day, "T00:00:00Z"))) &&
        new Date("".concat(day, "T00:00:00Z")).toISOString().slice(0, 10) === day;
};
var areMinutes = function (value) { return isObject(value) &&
    Object.entries(value).every(function (_a) {
        var day = _a[0], minutes = _a[1];
        return isDay(day) && typeof minutes === 'number' && Number.isFinite(minutes) && minutes >= 0;
    }); };
var arePeriods = function (value) { return Array.isArray(value) && value.every(function (period) {
    return isObject(period) && typeof period.start === 'number' && typeof period.end === 'number' &&
        Number.isFinite(new Date(period.start).getTime()) && Number.isFinite(new Date(period.end).getTime()) && period.end > period.start;
}); };
var isRealmTime = function (value) { return isObject(value) && isObject(value.days) &&
    areMinutes(value.accountedOnQuests) && areMinutes(value.accountedElsewhere) &&
    Object.entries(value.days).every(function (_a) {
        var day = _a[0], periods = _a[1];
        return isDay(day) && isObject(periods) && arePeriods(periods.onQuests) && arePeriods(periods.elsewhere);
    }); };
var parseRecord = function (text) {
    var _a, _b;
    try {
        var parsed = JSON.parse(text);
        return ((parsed === null || parsed === void 0 ? void 0 : parsed.version) === 1 || (parsed === null || parsed === void 0 ? void 0 : parsed.version) === 2) && Array.isArray(parsed.tasks) &&
            (parsed.realmTime === undefined || isRealmTime(parsed.realmTime))
            ? __assign(__assign({}, parsed), { version: 2, playNext: (_a = parsed.playNext) !== null && _a !== void 0 ? _a : null, feature: (_b = parsed.feature) !== null && _b !== void 0 ? _b : null, tasks: parsed.tasks.map(withDefaults), requests: Array.isArray(parsed.requests) ? parsed.requests : [] })
            : 'unreadable';
    }
    catch (_c) {
        return 'unreadable';
    }
};
exports.parseRecord = parseRecord;
// The last record that read, kept beside it before every write. Its name
// doesn't end in .json, so it is never taken for another project's record.
var backupPath = function (file) { return "".concat(file, ".bak"); };
exports.backupPath = backupPath;
// Why a record's text can't be read, in plain words, and whether a newer
// Queue-tea wrote it: going back to an older copy would then lose its work.
var whyUnreadable = function (text) {
    var parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (err) {
        return { reason: "it isn't valid JSON (".concat(err instanceof Error ? err.message : String(err), ")"), isNewer: false };
    }
    var version = parsed === null || parsed === void 0 ? void 0 : parsed.version;
    if (typeof version === 'number' && version > 2) {
        return { reason: "it was written by a newer Queue-tea (record version ".concat(version, "); update Queue-tea to read it"), isNewer: true };
    }
    return { reason: "it isn't a Queue-tea record", isNewer: false };
};
exports.whyUnreadable = whyUnreadable;
// What the menu says about a record that can't be read: why, and whether
// the last good copy can take its place. Null when it reads after all. A file
// Claude Code won't open says so, with what to check, since Try again alone
// can't fix that; the error itself goes to the debug log from the caller.
var readProblem = function (host, file) { return __awaiter(void 0, void 0, void 0, function () {
    var text, _a, why, bak, canRestore, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                return [4 /*yield*/, host.exists(file)];
            case 1:
                if (!(_e.sent()))
                    return [2 /*return*/, null];
                return [4 /*yield*/, host.read(file)];
            case 2:
                text = _e.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _e.sent();
                // The reading that failed first has logged why; this only says what to do.
                return [2 /*return*/, { reason: record_text_1.RECORD_TEXT.cannotOpen, canRestore: false, fix: record_text_1.RECORD_TEXT.cannotOpenFix(file) }];
            case 4:
                if ((0, exports.parseRecord)(text) !== 'unreadable')
                    return [2 /*return*/, null];
                why = (0, exports.whyUnreadable)(text);
                bak = (0, exports.backupPath)(file);
                _c = !why.isNewer;
                if (!_c) return [3 /*break*/, 6];
                return [4 /*yield*/, host.exists(bak)];
            case 5:
                _c = (_e.sent());
                _e.label = 6;
            case 6:
                _b = _c;
                if (!_b) return [3 /*break*/, 8];
                _d = exports.parseRecord;
                return [4 /*yield*/, host.read(bak)];
            case 7:
                _b = _d.apply(void 0, [_e.sent()]) !== 'unreadable';
                _e.label = 8;
            case 8:
                canRestore = _b;
                return [2 /*return*/, { reason: why.reason, canRestore: canRestore }];
        }
    });
}); };
exports.readProblem = readProblem;
// Puts the last good copy in place of a record that can't be read. The
// broken file is kept beside it as <file>.broken-<stamp>, never deleted.
// Nothing changes when the record reads after all or there is no good copy.
var restoreRecord = function (host, file, stamp) {
    return withLock(host, file, function () { return __awaiter(void 0, void 0, void 0, function () {
        var broken, _a, bak, text, _b, record, keptAt;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, host.exists(file)];
                case 1:
                    if (!(_c.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, host.read(file)];
                case 2:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = null;
                    _c.label = 4;
                case 4:
                    broken = _a;
                    if (broken !== null && (0, exports.parseRecord)(broken) !== 'unreadable')
                        return [2 /*return*/, 'readable'];
                    bak = (0, exports.backupPath)(file);
                    return [4 /*yield*/, host.exists(bak)];
                case 5:
                    if (!(_c.sent())) return [3 /*break*/, 7];
                    return [4 /*yield*/, host.read(bak)];
                case 6:
                    _b = _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _b = null;
                    _c.label = 8;
                case 8:
                    text = _b;
                    record = text === null ? 'unreadable' : (0, exports.parseRecord)(text);
                    if (text === null || record === 'unreadable' || (broken !== null && (0, exports.whyUnreadable)(broken).isNewer))
                        return [2 /*return*/, 'no-copy'];
                    keptAt = "".concat(file, ".broken-").concat(stamp);
                    if (!(broken !== null)) return [3 /*break*/, 10];
                    return [4 /*yield*/, host.write(keptAt, broken)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [4 /*yield*/, replaceWith(host, file, text)];
                case 11:
                    _c.sent();
                    return [2 /*return*/, { record: record, keptAt: keptAt }];
            }
        });
    }); });
};
exports.restoreRecord = restoreRecord;
// Writes a temp file of its own and renames it over the record, so no
// half-written file is left and two sessions never share one.
var replaceWith = function (host, file, text) { return __awaiter(void 0, void 0, void 0, function () {
    var tag, tmp, moved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tag = __spreadArray([], crypto.getRandomValues(new Uint8Array(4)), true).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
                tmp = "".concat(file, ".").concat(tag, ".tmp");
                return [4 /*yield*/, host.write(tmp, text)];
            case 1:
                _a.sent();
                return [4 /*yield*/, host.move(tmp, file)];
            case 2:
                moved = _a.sent();
                if (moved.exitCode !== 0)
                    throw new Error("mv of the record failed: ".concat(moved.stderr));
                return [2 /*return*/];
        }
    });
}); };
var readRecord = function (host, file, name, path) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4 /*yield*/, host.exists(file)];
        case 1:
            if (!(_c.sent())) return [3 /*break*/, 3];
            _b = exports.parseRecord;
            return [4 /*yield*/, host.read(file)];
        case 2:
            _a = _b.apply(void 0, [_c.sent()]);
            return [3 /*break*/, 4];
        case 3:
            _a = (0, exports.emptyRecord)(name, path);
            _c.label = 4;
        case 4: return [2 /*return*/, _a];
    }
}); }); };
exports.readRecord = readRecord;
var LOCK_TRIES = 40;
var LOCK_WAIT_MS = 50;
// One writer at a time across sessions. The lock is a folder beside the
// record, which mkdir makes only when it isn't there. A lock still there
// after two seconds of waiting is from a session that stopped mid-write,
// since a write takes milliseconds, so this write takes it over.
var withLock = function (host, file, work) { return __awaiter(void 0, void 0, void 0, function () {
    var lock, tries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lock = "".concat(file, ".lock");
                tries = 0;
                _a.label = 1;
            case 1:
                if (!(tries < LOCK_TRIES)) return [3 /*break*/, 8];
                return [4 /*yield*/, host.makeDir(lock)];
            case 2:
                if ((_a.sent()).exitCode === 0)
                    return [3 /*break*/, 8];
                return [4 /*yield*/, host.exists(lock)];
            case 3:
                if (!!(_a.sent())) return [3 /*break*/, 5];
                return [4 /*yield*/, host.makeDirs(file.slice(0, file.lastIndexOf('/')))];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, host.sleep(LOCK_WAIT_MS)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                tries += 1;
                return [3 /*break*/, 1];
            case 8:
                _a.trys.push([8, , 10, 12]);
                return [4 /*yield*/, work()];
            case 9: return [2 /*return*/, _a.sent()];
            case 10: return [4 /*yield*/, host.removeDir(lock)];
            case 11:
                _a.sent();
                return [7 /*endfinally*/];
            case 12: return [2 /*return*/];
        }
    });
}); };
// The text that read, as the last good copy. One too large to write at once,
// an older record full of step output, is kept as it read without that output.
var keepBackup = function (host, file, text, read) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 4]);
                return [4 /*yield*/, host.write((0, exports.backupPath)(file), text)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                err_1 = _a.sent();
                if (!(err_1 instanceof host_1.FileTooLarge))
                    throw err_1;
                return [4 /*yield*/, host.write((0, exports.backupPath)(file), JSON.stringify(read, null, 2))];
            case 3:
                _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Reads the file again right before writing, so another session's changes
// survive, and keeps what it read as the last good copy before replacing it.
// An unreadable file is never overwritten.
var updateRecord = function (host, file, change, name, path) {
    return withLock(host, file, function () { return __awaiter(void 0, void 0, void 0, function () {
        var text, _a, fresh, changed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, host.exists(file)];
                case 1:
                    if (!(_b.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, host.read(file)];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = null;
                    _b.label = 4;
                case 4:
                    text = _a;
                    fresh = text === null ? (0, exports.emptyRecord)(name, path) : (0, exports.parseRecord)(text);
                    if (fresh === 'unreadable')
                        return [2 /*return*/, 'unreadable'];
                    changed = change(fresh);
                    if (!(text !== null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, keepBackup(host, file, text, fresh)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [4 /*yield*/, replaceWith(host, file, JSON.stringify(changed, null, 2))];
                case 7:
                    _b.sent();
                    return [2 /*return*/, changed];
            }
        });
    }); });
};
exports.updateRecord = updateRecord;
// Every other project's queue, from the record files beside this one: its
// name, how many tasks wait, and its suggestion. Unreadable files are skipped.
var readOthers = function (host, file, suggestTitle) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, own, others, _i, _a, name_1, record, _b, waiting;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                dir = file.slice(0, file.lastIndexOf('/'));
                own = file.slice(dir.length + 1);
                others = [];
                _i = 0;
                return [4 /*yield*/, host.list(dir)];
            case 1:
                _a = (_c.sent()).filter(function (n) { return n.endsWith('.json') && n !== own; }).sort();
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                name_1 = _a[_i];
                _b = exports.parseRecord;
                return [4 /*yield*/, host.read("".concat(dir, "/").concat(name_1))];
            case 3:
                record = _b.apply(void 0, [_c.sent()]);
                if (record === 'unreadable')
                    return [3 /*break*/, 4];
                waiting = record.tasks.filter(function (t) { return t.state === 'queued'; }).length;
                if (waiting > 0)
                    others.push({ name: record.project.name, waiting: waiting, next: suggestTitle(record) });
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, others];
        }
    });
}); };
exports.readOthers = readOthers;
