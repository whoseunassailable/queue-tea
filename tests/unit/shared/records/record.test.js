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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var host_1 = require("../../../../hooks/core/host/host");
var record_text_1 = require("../../../../hooks/shared/records/domain/constants/record_text");
var record_source_1 = require("../../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../../../hooks/shared/records/domain/services/helpers");
var queue_rules_1 = require("../../../../hooks/shared/records/domain/services/queue_rules");
var helpers_2 = require("../../../helpers");
var FILE = (0, record_source_1.recordPath)('/Users/example', 'example-app-abc123');
var json = function (r) { return JSON.stringify(r); };
(0, testing_1.test)('recordPath is under ~/.queue-tea/projects', function () {
    (0, testing_1.expect)(FILE).toBe('/Users/example/.queue-tea/projects/example-app-abc123.json');
});
(0, testing_1.test)('projectKey: same folder name, different paths, different keys', function () {
    var a = (0, record_source_1.projectKey)('/a/frontend');
    var b = (0, record_source_1.projectKey)('/b/frontend');
    (0, testing_1.expect)(a).toMatch(/^frontend-[0-9a-f]{6}$/);
    (0, testing_1.expect)(b).toMatch(/^frontend-[0-9a-f]{6}$/);
    (0, testing_1.expect)(a === b).toBe(false);
    (0, testing_1.expect)((0, record_source_1.projectKey)('/a/frontend/')).toBe(a);
});
(0, testing_1.test)('a missing file reads as an empty record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                host = (0, helpers_2.memoryHost)().host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readRecord)(host, FILE, 'example-app', '/x/example-app')];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual((0, record_source_1.emptyRecord)('example-app', '/x/example-app'));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('updateRecord keeps a task another session wrote in between', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, c, b, mem, saved;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                a = (0, helpers_2.makeTask)({ title: 'A' });
                c = (0, helpers_2.makeTask)({ title: 'C' });
                b = (0, helpers_2.makeTask)({ title: 'B' });
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [a] })), _a) });
                // Another session writes C after this one last read the file.
                mem.files.set(FILE, json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [a, c] })));
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: __spreadArray(__spreadArray([], r.tasks, true), [b], false) })); }, 'p', '/p')];
            case 1:
                saved = _b.sent();
                (0, testing_1.expect)(saved === 'unreadable' ? [] : saved.tasks.map(function (t) { return t.title; })).toEqual(['A', 'C', 'B']);
                (0, testing_1.expect)(JSON.parse(mem.files.get(FILE)).tasks.map(function (t) { return t.title; })).toEqual([
                    'A',
                    'C',
                    'B',
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('updateRecord writes through a temp file and mv', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, tmp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return r; }, 'p', '/p')];
            case 1:
                _a.sent();
                tmp = mem.writes[0];
                (0, testing_1.expect)(tmp).toMatch(/\.[0-9a-f]{8}\.tmp$/);
                (0, testing_1.expect)(mem.runs).toEqual([['mkdir', "".concat(FILE, ".lock")], ['mv', '-f', tmp, FILE], ['rmdir', "".concat(FILE, ".lock")]]);
                (0, testing_1.expect)(mem.files.has(tmp)).toBe(false);
                (0, testing_1.expect)(mem.files.has(FILE)).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record is never overwritten', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_b = {}, _b[FILE] = '{not json', _b) });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return r; }, 'p', '/p')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('unreadable');
                (0, testing_1.expect)(mem.writes).toEqual([]);
                (0, testing_1.expect)(mem.runs).toEqual([['mkdir', "".concat(FILE, ".lock")], ['rmdir', "".concat(FILE, ".lock")]]);
                (0, testing_1.expect)(mem.files.get(FILE)).toBe('{not json');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record of version 3 is unreadable', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = (0, helpers_2.memoryHost)({ files: (_b = {}, _b[FILE] = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { version: 3 })), _b) }).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readRecord)(host, FILE, 'p', '/p')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('unreadable');
                return [2 /*return*/];
        }
    });
}); });
var OLD = '/h/.queue-tie/projects';
var NEW = '/h/.queue-tea/projects';
var COPY = (_a = { 'mkdir -p /h/.queue-tea': {} }, _a["cp -Rp ".concat(OLD, " ").concat(NEW)] = {}, _a);
(0, testing_1.test)('the first start after the rename copies the Queue-tie records over', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_b = {}, _b[OLD] = '', _b), git: COPY });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.carryOverRecords)(mem.host, '/h')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('copied');
                (0, testing_1.expect)(mem.runs).toEqual([
                    ['mkdir', '-p', '/h/.queue-tea'],
                    ['cp', '-Rp', OLD, NEW],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('records are not copied once ~/.queue-tea exists, without old ones, or without a home', function () { return __awaiter(void 0, void 0, void 0, function () {
    var both, none, homeless, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                both = (0, helpers_2.memoryHost)({ files: (_d = {}, _d[OLD] = '', _d[NEW] = '', _d), git: COPY });
                none = (0, helpers_2.memoryHost)({ git: COPY });
                homeless = (0, helpers_2.memoryHost)({ files: { '/.queue-tie/projects': '' }, git: COPY });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.carryOverRecords)(both.host, '/h')];
            case 1:
                _a.apply(void 0, [_e.sent()]).toBe('none');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.carryOverRecords)(none.host, '/h')];
            case 2:
                _b.apply(void 0, [_e.sent()]).toBe('none');
                _c = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.carryOverRecords)(homeless.host, '')];
            case 3:
                _c.apply(void 0, [_e.sent()]).toBe('none');
                (0, testing_1.expect)(__spreadArray(__spreadArray(__spreadArray([], both.runs, true), none.runs, true), homeless.runs, true)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a copy that fails says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[OLD] = '', _a), git: { 'mkdir -p /h/.queue-tea': {} } });
                return [4 /*yield*/, (0, testing_1.expect)((0, record_source_1.carryOverRecords)(mem.host, '/h')).rejects.toThrow('cp of the old records failed')];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('why a record cannot be read: bad JSON, a newer Queue-tea, or not a record', function () {
    (0, testing_1.expect)((0, record_source_1.whyUnreadable)('{bad').reason).toMatch(/^it isn't valid JSON \(.+\)$/);
    (0, testing_1.expect)((0, record_source_1.whyUnreadable)(json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { version: 3 })))).toEqual({
        reason: 'it was written by a newer Queue-tea (record version 3); update Queue-tea to read it',
        isNewer: true,
    });
    (0, testing_1.expect)((0, record_source_1.whyUnreadable)('[1, 2]')).toEqual({ reason: "it isn't a Queue-tea record", isNewer: false });
});
(0, testing_1.test)('each write keeps the record it replaced as the last good copy', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, mem;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                before = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_2.makeTask)({ title: 'A' })] }));
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = before, _a) });
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: [] })); }, 'p', '/p')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(mem.files.get((0, record_source_1.backupPath)(FILE))).toBe(before);
                (0, testing_1.expect)(JSON.parse(mem.files.get(FILE)).tasks).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the first write of a new record has no copy to keep', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return r; }, 'p', '/p')];
            case 1:
                _a.sent();
                (0, testing_1.expect)(mem.files.has((0, record_source_1.backupPath)(FILE))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the last good copy is not taken for another project', function () { return __awaiter(void 0, void 0, void 0, function () {
    var other, mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                other = (0, record_source_1.recordPath)('/Users/example', 'other-def456');
                mem = (0, helpers_2.memoryHost)({
                    files: (_b = {},
                        _b[FILE] = json((0, record_source_1.emptyRecord)('example-app', '/x')),
                        _b[(0, record_source_1.backupPath)(other)] = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('other', '/o')), { tasks: [(0, helpers_2.makeTask)()] })),
                        _b["".concat(other, ".broken-2026-10-26T09-00-00")] = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('other', '/o')), { tasks: [(0, helpers_2.makeTask)()] })),
                        _b),
                });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readOthers)(mem.host, FILE, function () { return null; })];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a broken record with a good copy can be restored; the broken file is kept', function () { return __awaiter(void 0, void 0, void 0, function () {
    var good, mem, _a, restored;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                good = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_2.makeTask)({ title: 'Kept' })] }));
                mem = (0, helpers_2.memoryHost)({ files: (_b = {}, _b[FILE] = '{bad', _b[(0, record_source_1.backupPath)(FILE)] = good, _b) });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readProblem)(mem.host, FILE)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toMatchObject({ canRestore: true });
                return [4 /*yield*/, (0, record_source_1.restoreRecord)(mem.host, FILE, '2026-10-26T09-00-00')];
            case 2:
                restored = _c.sent();
                (0, testing_1.expect)(restored).toMatchObject({ keptAt: "".concat(FILE, ".broken-2026-10-26T09-00-00") });
                (0, testing_1.expect)(restored !== 'readable' && restored !== 'no-copy' && restored.record.tasks.map(function (t) { return t.title; })).toEqual(['Kept']);
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(good);
                (0, testing_1.expect)(mem.files.get("".concat(FILE, ".broken-2026-10-26T09-00-00"))).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('no restore over a newer Queue-tea’s record, without a copy, or from a broken copy', function () { return __awaiter(void 0, void 0, void 0, function () {
    var good, newer, cases, _i, cases_1, mem, before, _a, _b;
    var _c, _d, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                good = json((0, record_source_1.emptyRecord)('p', '/p'));
                newer = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { version: 3 }));
                cases = [
                    (0, helpers_2.memoryHost)({ files: (_c = {}, _c[FILE] = newer, _c[(0, record_source_1.backupPath)(FILE)] = good, _c) }),
                    (0, helpers_2.memoryHost)({ files: (_d = {}, _d[FILE] = '{bad', _d) }),
                    (0, helpers_2.memoryHost)({ files: (_e = {}, _e[FILE] = '{bad', _e[(0, record_source_1.backupPath)(FILE)] = '{also bad', _e) }),
                ];
                _i = 0, cases_1 = cases;
                _g.label = 1;
            case 1:
                if (!(_i < cases_1.length)) return [3 /*break*/, 5];
                mem = cases_1[_i];
                before = new Map(mem.files);
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readProblem)(mem.host, FILE)];
            case 2:
                _a.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.canRestore]).toBe(false);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.restoreRecord)(mem.host, FILE, 'x')];
            case 3:
                _b.apply(void 0, [_g.sent()]).toBe('no-copy');
                (0, testing_1.expect)(mem.files).toEqual(before);
                _g.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record that reads is never restored over', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, mem, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                now = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_2.makeTask)({ title: 'Now' })] }));
                mem = (0, helpers_2.memoryHost)({ files: (_c = {}, _c[FILE] = now, _c[(0, record_source_1.backupPath)(FILE)] = json((0, record_source_1.emptyRecord)('p', '/p')), _c) });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readProblem)(mem.host, FILE)];
            case 1:
                _a.apply(void 0, [_d.sent()]).toBe(null);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.restoreRecord)(mem.host, FILE, 'x')];
            case 2:
                _b.apply(void 0, [_d.sent()]).toBe('readable');
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(now);
                return [2 /*return*/];
        }
    });
}); });
// Lets other work waiting on promises run, n turns of it.
var turns = function (n) { return __awaiter(void 0, void 0, void 0, function () {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < n)) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.resolve()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i += 1;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
(0, testing_1.test)('two sessions writing at once both keep their change', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, letGo, held, read, reads, add, first, second;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = json((0, record_source_1.emptyRecord)('p', '/p')), _a) });
                letGo = function () { };
                held = new Promise(function (resolve) { return (letGo = resolve); });
                read = mem.host.read;
                reads = 0;
                mem.host.read = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    var text;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, read(path)];
                            case 1:
                                text = _a.sent();
                                reads += 1;
                                if (!(path === FILE && reads === 1)) return [3 /*break*/, 3];
                                return [4 /*yield*/, held];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, text];
                        }
                    });
                }); };
                mem.host.sleep = function () { return turns(10); };
                add = function (title) { return function (r) { return (__assign(__assign({}, r), { tasks: __spreadArray(__spreadArray([], r.tasks, true), [(0, helpers_2.makeTask)({ title: title })], false) })); }; };
                first = (0, record_source_1.updateRecord)(mem.host, FILE, add('From A'), 'p', '/p');
                second = (0, record_source_1.updateRecord)(mem.host, FILE, add('From B'), 'p', '/p');
                return [4 /*yield*/, turns(20)];
            case 1:
                _b.sent();
                letGo();
                return [4 /*yield*/, Promise.all([first, second])];
            case 2:
                _b.sent();
                (0, testing_1.expect)(JSON.parse(mem.files.get(FILE)).tasks.map(function (t) { return t.title; })).toEqual(['From A', 'From B']);
                (0, testing_1.expect)(mem.dirs.has("".concat(FILE, ".lock"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a lock left by a session that stopped is taken over', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, saved;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = json((0, record_source_1.emptyRecord)('p', '/p')), _a) });
                mem.dirs.add("".concat(FILE, ".lock"));
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { docsLogPath: 'docs/log.md' })); }, 'p', '/p')];
            case 1:
                saved = _b.sent();
                (0, testing_1.expect)(saved === 'unreadable' ? null : saved.docsLogPath).toBe('docs/log.md');
                (0, testing_1.expect)(mem.runs.filter(function (argv) { return argv[0] === 'mkdir'; })).toHaveLength(40);
                (0, testing_1.expect)(mem.dirs.has("".concat(FILE, ".lock"))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the first record of all makes its folder before the lock', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, mkdir, isFolder, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                mkdir = mem.host.run;
                isFolder = false;
                // Without the folder, mkdir of the lock fails and nothing is there.
                mem.host.run = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (argv[0] === 'mkdir' && argv[1] === '-p')
                            isFolder = true;
                        else if (argv[0] === 'mkdir' && !isFolder)
                            return [2 /*return*/, { exitCode: 1, stdout: '', stderr: 'No such file or directory' }];
                        return [2 /*return*/, mkdir(argv)];
                    });
                }); };
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return r; }, 'p', '/p')];
            case 1:
                _a.apply(void 0, [_b.sent()]).not.toBe('unreadable');
                (0, testing_1.expect)(mem.runs.map(function (argv) { return argv.join(' '); })).toEqual([
                    "mkdir ".concat(FILE.slice(0, FILE.lastIndexOf('/'))).replace('mkdir ', 'mkdir -p '),
                    "mkdir ".concat(FILE, ".lock"),
                    testing_1.expect.stringMatching(/^mv -f /),
                    "rmdir ".concat(FILE, ".lock"),
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record from before the app reads with the new fields empty', function () {
    var old = { version: 1, project: { name: 'p', path: '/p' }, tasks: [{ title: 'A', created: 'x' }] };
    var read = (0, record_source_1.parseRecord)(JSON.stringify(old));
    if (read === 'unreadable')
        throw new Error('should read');
    (0, testing_1.expect)(read.requests).toEqual([]);
    (0, testing_1.expect)(read.tasks[0]).toMatchObject({ description: null, criteria: [], review: null });
});
(0, testing_1.test)('requests that are not a list read as none', function () {
    var read = (0, record_source_1.parseRecord)(JSON.stringify({ version: 1, project: { name: 'p', path: '/p' }, tasks: [], requests: 'nonsense' }));
    if (read === 'unreadable')
        throw new Error('should read');
    (0, testing_1.expect)(read.requests).toEqual([]);
});
(0, testing_1.test)('fields one side does not know survive a write by the other', function () { return __awaiter(void 0, void 0, void 0, function () {
    var written, mem, after;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                written = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { fromTheApp: 1, tasks: [__assign(__assign({}, (0, helpers_2.makeTask)({ title: 'A' })), { fromTheApp: 2 })] });
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = JSON.stringify(written), _a) });
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { playNext: null })); }, 'p', '/p')];
            case 1:
                _b.sent();
                after = JSON.parse(mem.files.get(FILE));
                (0, testing_1.expect)(after.fromTheApp).toBe(1);
                (0, testing_1.expect)(after.tasks[0].fromTheApp).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
var readFirst = function (task) {
    var read = (0, record_source_1.parseRecord)(JSON.stringify({ version: 1, project: { name: 'p', path: '/p' }, tasks: [task] }));
    return read === 'unreadable' ? null : read.tasks[0];
};
(0, testing_1.test)('an older task without helpers reads with Tea-DD on', function () {
    var _a;
    (0, testing_1.expect)((_a = readFirst({ title: 'Old', created: '2026-10-01' })) === null || _a === void 0 ? void 0 : _a.helpers).toEqual({ on: ['tea-dd'], ran: [], reminded: false });
});
(0, testing_1.test)('a partial helpers field is filled in', function () {
    var _a;
    (0, testing_1.expect)((_a = readFirst({ title: 'Old', created: '2026-10-01', helpers: { on: ['chai-pter'] } })) === null || _a === void 0 ? void 0 : _a.helpers).toEqual({
        on: ['chai-pter'],
        ran: [],
        reminded: false,
    });
});
(0, testing_1.test)('a malformed helpers field is read as the default', function () {
    var _a, _b;
    var read = function (helpers) { var _a; return (_a = readFirst({ title: 'Old', created: '2026-10-01', helpers: helpers })) === null || _a === void 0 ? void 0 : _a.helpers; };
    (0, testing_1.expect)(read({ on: null })).toEqual((0, helpers_1.defaultHelpers)());
    (0, testing_1.expect)((_a = read({ on: 'tea-dd' })) === null || _a === void 0 ? void 0 : _a.on).toEqual(['tea-dd']);
    (0, testing_1.expect)(read({ on: ['nobody', 'chai-pter'], ran: 'x' })).toEqual({ on: ['chai-pter'], ran: [], reminded: false });
    (0, testing_1.expect)((_b = read({ reminded: 'yes' })) === null || _b === void 0 ? void 0 : _b.reminded).toBe(false);
});
(0, testing_1.test)('a new task starts with Tea-DD on', function () {
    var t = (0, queue_rules_1.newTask)({ title: 'T', priority: 'mid', difficulty: 'medium', messages: [], now: '2026-11-03', id: 't-1' });
    (0, testing_1.expect)(t.helpers).toEqual((0, helpers_1.defaultHelpers)());
});
(0, testing_1.test)('onlyHelpers drops repeats and keeps the list order', function () {
    (0, testing_1.expect)((0, helpers_1.onlyHelpers)(['tea-dd', 'commit-chai-n', 'tea-dd'])).toEqual(['commit-chai-n', 'tea-dd']);
});
(0, testing_1.test)('isHelperId knows only the four', function () {
    (0, testing_1.expect)((0, helpers_1.isHelperId)('tea-dd')).toBe(true);
    for (var _i = 0, _a = ['general-purpose', '', 3, null]; _i < _a.length; _i++) {
        var v = _a[_i];
        (0, testing_1.expect)((0, helpers_1.isHelperId)(v)).toBe(false);
    }
});
(0, testing_1.test)("a task saved before Codex reads as Claude Code's, and a new task starts with Claude Code", function () {
    var _a;
    var old = (0, helpers_2.makeTask)({ state: 'current' });
    delete old.codexSince;
    var read = (0, record_source_1.parseRecord)(json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [old] })));
    (0, testing_1.expect)(read === 'unreadable' ? 'unreadable' : (_a = read.tasks[0]) === null || _a === void 0 ? void 0 : _a.codexSince).toBeNull();
    (0, testing_1.expect)((0, queue_rules_1.newTask)({ title: 'X', priority: 'mid', difficulty: 'light', messages: [], now: '2026-10-21T09:00:00+02:00', id: 't-1' }).codexSince).toBeNull();
});
(0, testing_1.test)('when a task went to Codex survives a write and a read', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, task, read;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                task = (0, helpers_2.makeTask)({ state: 'current', codexSince: '2026-10-21T09:00:00+02:00' });
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: [task] })); }, 'p', '/p')];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, record_source_1.readRecord)(mem.host, FILE, 'p', '/p')];
            case 2:
                read = _b.sent();
                (0, testing_1.expect)(read === 'unreadable' ? 'unreadable' : (_a = read.tasks[0]) === null || _a === void 0 ? void 0 : _a.codexSince).toBe('2026-10-21T09:00:00+02:00');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('version 1 migrates without moving its current task or losing unknown fields', function () {
    var old = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { version: 1, future: 'preserved', tasks: [(0, helpers_2.makeTask)({ state: 'current' })] });
    var parsed = (0, record_source_1.parseRecord)(JSON.stringify(old));
    (0, testing_1.expect)(parsed).not.toBe('unreadable');
    if (parsed === 'unreadable')
        return;
    (0, testing_1.expect)(parsed.version).toBe(2);
    (0, testing_1.expect)(parsed.tasks[0].worktreePath).toBeNull();
    (0, testing_1.expect)(parsed.future).toBe('preserved');
});
(0, testing_1.test)('a task saved before test profiles reads with no profile and no testing time', function () {
    var read = readFirst({ title: 'Old', created: '2026-10-01' });
    (0, testing_1.expect)(read === null || read === void 0 ? void 0 : read.testProfile).toBeUndefined();
    (0, testing_1.expect)(read === null || read === void 0 ? void 0 : read.testPeriods).toBeUndefined();
    (0, testing_1.expect)(read === null || read === void 0 ? void 0 : read.minutesInChecks).toBeUndefined();
    (0, testing_1.expect)(Object.keys(read !== null && read !== void 0 ? read : {})).not.toContain('testProfile');
});
(0, testing_1.test)("Tea-DD's pick, Rohan's pick and the testing time survive a write and a read", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, tasks, read;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                tasks = [
                    (0, helpers_2.makeTask)({ id: 'a', testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' }, testPeriods: [{ start: 1000, end: 61000 }], minutesInChecks: 0.75 }),
                    (0, helpers_2.makeTask)({ id: 'b', testProfile: { id: 'quick', by: 'rohan' } }),
                ];
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: tasks })); }, 'p', '/p')];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, record_source_1.readRecord)(mem.host, FILE, 'p', '/p')];
            case 2:
                read = _b.sent();
                if (read === 'unreadable')
                    throw new Error('should read');
                (0, testing_1.expect)(read.tasks[0]).toMatchObject({ testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' }, testPeriods: [{ start: 1000, end: 61000 }], minutesInChecks: 0.75 });
                (0, testing_1.expect)((_a = read.tasks[1]) === null || _a === void 0 ? void 0 : _a.testProfile).toEqual({ id: 'quick', by: 'rohan' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a malformed profile is read as none, and the realm still reads', function () {
    var profile = function (testProfile) { var _a; return (_a = readFirst({ title: 'Old', created: '2026-10-01', testProfile: testProfile })) === null || _a === void 0 ? void 0 : _a.testProfile; };
    for (var _i = 0, _a = [null, 'deep', [], { id: 'huge', by: 'tea-dd', reason: 'x' }, { id: 'deep' }, { id: 'deep', by: 'someone' }, { id: 'deep', by: 'tea-dd' }, { id: 'deep', by: 'tea-dd', reason: '   ' }, { id: 'deep', by: 'tea-dd', reason: 7 }]; _i < _a.length; _i++) {
        var bad = _a[_i];
        (0, testing_1.expect)(profile(bad)).toBeUndefined();
    }
});
(0, testing_1.test)("a hand-edited profile is tidied: Rohan's loses a reason, a long reason is cut to 160 characters", function () {
    var profile = function (testProfile) { var _a; return (_a = readFirst({ title: 'Old', created: '2026-10-01', testProfile: testProfile })) === null || _a === void 0 ? void 0 : _a.testProfile; };
    (0, testing_1.expect)(profile({ id: 'critical', by: 'rohan', reason: 'ignored' })).toEqual({ id: 'critical', by: 'rohan' });
    (0, testing_1.expect)(profile({ id: 'deep', by: 'tea-dd', reason: "  ".concat('x'.repeat(200)) })).toEqual({ id: 'deep', by: 'tea-dd', reason: 'x'.repeat(160) });
});
(0, testing_1.test)('malformed testing spans and minutes are dropped, and the realm still reads', function () {
    var _a, _b, _c;
    var task = function (over) { return readFirst(__assign({ title: 'Old', created: '2026-10-01' }, over)); };
    for (var _i = 0, _d = ['x', {}, [{ start: 5, end: 1 }], [{ start: 1, end: 1 }], [{ start: '1', end: 2 }], [{ start: 1, end: 2 }, null]]; _i < _d.length; _i++) {
        var testPeriods = _d[_i];
        (0, testing_1.expect)((_a = task({ testPeriods: testPeriods })) === null || _a === void 0 ? void 0 : _a.testPeriods).toBeUndefined();
    }
    for (var _e = 0, _f = [-1, '3', null, Number.NaN]; _e < _f.length; _e++) {
        var minutesInChecks = _f[_e];
        (0, testing_1.expect)((_b = task({ minutesInChecks: minutesInChecks })) === null || _b === void 0 ? void 0 : _b.minutesInChecks).toBeUndefined();
    }
    (0, testing_1.expect)((_c = task({ minutesInChecks: 0 })) === null || _c === void 0 ? void 0 : _c.minutesInChecks).toBe(0);
});
(0, testing_1.test)('a task saved before due dates reads with none', function () {
    var read = readFirst({ title: 'Old', created: '2026-10-01' });
    (0, testing_1.expect)(Object.keys(read !== null && read !== void 0 ? read : {})).not.toContain('due');
});
(0, testing_1.test)('a due date survives a write and a read', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, read;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)();
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: [(0, helpers_2.makeTask)({ id: 'a', due: '2026-12-01' })] })); }, 'p', '/p')];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, record_source_1.readRecord)(mem.host, FILE, 'p', '/p')];
            case 2:
                read = _b.sent();
                if (read === 'unreadable')
                    throw new Error('should read');
                (0, testing_1.expect)((_a = read.tasks[0]) === null || _a === void 0 ? void 0 : _a.due).toBe('2026-12-01');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a malformed due date is dropped, and the realm still reads', function () {
    var _a, _b;
    var due = function (value) { return readFirst({ title: 'Old', created: '2026-10-01', due: value }); };
    for (var _i = 0, _c = [null, 7, '', 'soon', '2026-13-01', '2026-02-30', '2026-12-01T09:00', ' 2026-12-01', ['2026-12-01']]; _i < _c.length; _i++) {
        var bad = _c[_i];
        (0, testing_1.expect)(Object.keys((_a = due(bad)) !== null && _a !== void 0 ? _a : {})).not.toContain('due');
    }
    (0, testing_1.expect)((_b = due('2028-02-29')) === null || _b === void 0 ? void 0 : _b.due).toBe('2028-02-29');
});
(0, testing_1.test)('testing spans saved overlapping read back merged, in order', function () {
    var read = readFirst({ title: 'Old', created: '2026-10-01', testPeriods: [{ start: 50, end: 90 }, { start: 10, end: 30 }, { start: 20, end: 40 }] });
    (0, testing_1.expect)(read === null || read === void 0 ? void 0 : read.testPeriods).toEqual([{ start: 10, end: 40 }, { start: 50, end: 90 }]);
});
// An entry of the step log records kept before the one-step line.
var logged = function (id, at, extra) {
    if (extra === void 0) { extra = {}; }
    return (__assign({ id: id, at: at, finished: at, kind: 'test', status: 'succeeded', subject: 'npm test', output: "output of ".concat(id), truncated: false }, extra));
};
(0, testing_1.test)("an older record's step log is dropped: the task keeps its latest step, and the checks it still waits on, without output", function () {
    var task = __assign(__assign({}, (0, helpers_2.makeTask)({ title: 'A' })), { activity: [
            logged('s2', '2026-10-21T09:20:00+02:00', { kind: 'edit', subject: '/p/a.ts' }),
            logged('s1', '2026-10-21T09:10:00+02:00', { status: 'running', finished: null, backgroundId: 'bg-1' }),
            { id: 'bad', at: 'never' },
        ] });
    var read = (0, record_source_1.parseRecord)(JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })));
    if (read === 'unreadable')
        throw new Error('unreadable');
    var kept = read.tasks[0];
    (0, testing_1.expect)(kept.activity).toBeUndefined();
    (0, testing_1.expect)(kept.step).toEqual({ id: 's2', at: '2026-10-21T09:20:00+02:00', finished: '2026-10-21T09:20:00+02:00', kind: 'edit', status: 'succeeded', subject: '/p/a.ts' });
    (0, testing_1.expect)(kept.waiting).toEqual([{ id: 's1', at: '2026-10-21T09:10:00+02:00', finished: null, kind: 'test', status: 'running', subject: 'npm test', backgroundId: 'bg-1' }]);
    (0, testing_1.expect)(JSON.stringify(read)).not.toContain('output of');
});
(0, testing_1.test)('a hand-edited step that is malformed is dropped, never the record', function () {
    var _a, _b;
    var read = (0, record_source_1.parseRecord)(JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [__assign(__assign({}, (0, helpers_2.makeTask)()), { step: { id: 's1', kind: 'dance' }, waiting: 'soon' })] })));
    if (read === 'unreadable')
        throw new Error('unreadable');
    (0, testing_1.expect)((_a = read.tasks[0]) === null || _a === void 0 ? void 0 : _a.step).toBeUndefined();
    (0, testing_1.expect)((_b = read.tasks[0]) === null || _b === void 0 ? void 0 : _b.waiting).toBeUndefined();
});
(0, testing_1.test)('a record too large to keep as it read is kept as its last good copy without the old step log', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, before, mem, write, copy;
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = __assign(__assign({}, (0, helpers_2.makeTask)({ title: 'A' })), { activity: [logged('s1', '2026-10-21T09:10:00+02:00')] });
                before = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] }));
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = before, _a) });
                write = mem.host.write;
                mem.host.write = function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (text === before)
                                    throw new host_1.FileTooLarge(path, text.length, text.length - 1);
                                return [4 /*yield*/, write(path, text)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return r; }, 'p', '/p')];
            case 1:
                _c.sent();
                copy = (0, record_source_1.parseRecord)(mem.files.get((0, record_source_1.backupPath)(FILE)));
                if (copy === 'unreadable')
                    throw new Error('unreadable');
                (0, testing_1.expect)((_b = copy.tasks[0]) === null || _b === void 0 ? void 0 : _b.title).toBe('A');
                (0, testing_1.expect)(mem.files.get((0, record_source_1.backupPath)(FILE))).not.toContain('output of');
                (0, testing_1.expect)(mem.files.get(FILE)).not.toContain('"activity"');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('any other failure to keep the last good copy stops the write', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, mem, write, failed, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                before = json(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_2.makeTask)({ title: 'A' })] }));
                mem = (0, helpers_2.memoryHost)({ files: (_a = {}, _a[FILE] = before, _a) });
                write = mem.host.write;
                mem.host.write = function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (path === (0, record_source_1.backupPath)(FILE))
                                    throw new Error('disk full');
                                return [4 /*yield*/, write(path, text)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                failed = '';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, FILE, function (r) { return (__assign(__assign({}, r), { tasks: [] })); }, 'p', '/p')];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                failed = err_1 instanceof Error ? err_1.message : String(err_1);
                return [3 /*break*/, 4];
            case 4:
                (0, testing_1.expect)(failed).toBe('disk full');
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record the host will not open says so, and what to check, with no copy offered', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_2.memoryHost)({ files: (_b = {}, _b[FILE] = json((0, record_source_1.emptyRecord)('p', '/p')), _b) });
                mem.host.read = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    throw new Error('EACCES: permission denied');
                }); }); };
                _a = testing_1.expect;
                return [4 /*yield*/, (0, record_source_1.readProblem)(mem.host, FILE)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual({ reason: record_text_1.RECORD_TEXT.cannotOpen, canRestore: false, fix: record_text_1.RECORD_TEXT.cannotOpenFix(FILE) });
                return [2 /*return*/];
        }
    });
}); });
