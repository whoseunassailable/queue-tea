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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../../hooks/shared/records/data/datasources/record_source");
var game_1 = require("./game");
var id = 0;
var won = function (finished, actual, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: "t-".concat((id += 1)), title: 'x', state: 'done', priority: 'mid', difficulty: { expected: 'medium', actual: actual }, finished: finished, created: finished, parentId: null, minutesByDay: {} }, over));
};
var record = function (tasks) { return (__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks })); };
var NOW = Date.parse('2026-10-27T17:50:00+01:00');
var badge = function (records, which, now) {
    if (now === void 0) { now = NOW; }
    return (0, game_1.gameOf)(records, 60, now).badges.find(function (b) { return b.id === which; });
};
// The records as of 27 Oct, from section 2.2 of the design.
var AS_OF_27_OCT = [
    record([
        won('2026-10-20T11:00:00+02:00', 'light'),
        won('2026-10-21T15:00:00+02:00', 'light'),
        won('2026-10-22T16:30:00+02:00', 'medium'),
        won('2026-10-27T03:30:00+01:00', 'hard'),
    ]),
    record([won('2026-10-20T14:00:00+02:00', 'medium')]),
];
(0, vitest_1.describe)('the rules', function () {
    (0, vitest_1.it)('pays by the actual difficulty', function () {
        (0, vitest_1.expect)([(0, game_1.xpOf)('light'), (0, game_1.xpOf)('medium'), (0, game_1.xpOf)('hard')]).toEqual([10, 25, 50]);
        (0, vitest_1.expect)((0, game_1.gameOf)([record([won('2026-10-20T11:00:00+02:00', 'hard', { difficulty: { expected: 'light', actual: 'hard' } })])], 60, NOW).xp).toBe(50);
    });
    (0, vitest_1.it)('counts levels as the design does', function () {
        (0, vitest_1.expect)((0, game_1.levelOf)(0).level).toBe(1);
        (0, vitest_1.expect)((0, game_1.levelOf)(99).level).toBe(1);
        (0, vitest_1.expect)((0, game_1.levelOf)(100).level).toBe(2);
        (0, vitest_1.expect)((0, game_1.levelOf)(300).level).toBe(3);
        (0, vitest_1.expect)((0, game_1.levelOf)(1000).level).toBe(5);
        (0, vitest_1.expect)((0, game_1.levelOf)(120)).toEqual({ level: 2, into: 20, toNext: 200 });
    });
    (0, vitest_1.it)('grows the dragon at the right levels', function () {
        (0, vitest_1.expect)([1, 2, 4, 5, 9, 10, 19, 20].map(game_1.stageOf)).toEqual(['egg', 'hatchling', 'hatchling', 'young', 'young', 'adult', 'adult', 'elder']);
    });
});
(0, vitest_1.describe)('the records as of 27 Oct', function () {
    var game = (0, game_1.gameOf)(AS_OF_27_OCT, 60, NOW);
    (0, vitest_1.it)('gives the figures in the design', function () {
        (0, vitest_1.expect)(game).toMatchObject({ victories: 5, xp: 120, gold: 120, level: 2, xpIntoLevel: 20, xpToNextLevel: 200, stage: 'hatchling', streak: 1, bestStreak: 3 });
    });
    (0, vitest_1.it)('earns First Flame and Night Owl and nothing else', function () {
        (0, vitest_1.expect)(game.badges.filter(function (b) { return b.earnedOn !== null; }).map(function (b) { return [b.id, b.earnedOn]; })).toEqual([
            ['firstFlame', '2026-10-20'],
            ['nightOwl', '2026-10-27'],
        ]);
    });
});
(0, vitest_1.describe)('streaks', function () {
    var days = function () {
        var d = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            d[_i] = arguments[_i];
        }
        return [record(d.map(function (day) { return won("".concat(day, "T12:00:00+01:00"), 'light'); }))];
    };
    (0, vitest_1.it)('counts a run across midnight by the local day', function () {
        var late = won('2026-10-26T23:50:00+01:00', 'light');
        var early = won('2026-10-27T00:10:00+01:00', 'light');
        (0, vitest_1.expect)((0, game_1.gameOf)([record([late, early])], 60, NOW).streak).toBe(2);
    });
    (0, vitest_1.it)('stays alive through the next day and dies the day after', function () {
        (0, vitest_1.expect)((0, game_1.gameOf)(days('2026-10-26'), 60, NOW).streak).toBe(1);
        (0, vitest_1.expect)((0, game_1.gameOf)(days('2026-10-25'), 60, NOW).streak).toBe(0);
    });
    (0, vitest_1.it)('is zero with no victories', function () {
        (0, vitest_1.expect)((0, game_1.gameOf)([], 60, NOW)).toMatchObject({ streak: 0, bestStreak: 0, level: 1, stage: 'egg', xp: 0 });
    });
    (0, vitest_1.it)('knows today counts after a win today', function () {
        (0, vitest_1.expect)((0, game_1.gameOf)(days('2026-10-27'), 60, NOW).wonToday).toBe(true);
    });
    (0, vitest_1.it)('knows today is still to win with the last win yesterday', function () {
        (0, vitest_1.expect)((0, game_1.gameOf)(days('2026-10-26'), 60, NOW)).toMatchObject({ streak: 1, wonToday: false });
    });
    (0, vitest_1.it)('knows today is still to win with no wins at all', function () {
        (0, vitest_1.expect)((0, game_1.gameOf)([], 60, NOW).wonToday).toBe(false);
    });
});
(0, vitest_1.describe)('badges', function () {
    (0, vitest_1.it)('Night Owl covers 22:00 to 03:59 and no later', function () {
        (0, vitest_1.expect)(badge([record([won('2026-10-20T22:00:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe('2026-10-20');
        (0, vitest_1.expect)(badge([record([won('2026-10-20T03:59:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe('2026-10-20');
        (0, vitest_1.expect)(badge([record([won('2026-10-20T04:00:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe(null);
        (0, vitest_1.expect)(badge([record([won('2026-10-20T21:59:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe(null);
    });
    (0, vitest_1.it)('Early Bird covers 05:00 to 08:59', function () {
        (0, vitest_1.expect)(badge([record([won('2026-10-20T05:00:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe('2026-10-20');
        (0, vitest_1.expect)(badge([record([won('2026-10-20T08:59:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe('2026-10-20');
        (0, vitest_1.expect)(badge([record([won('2026-10-20T09:00:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe(null);
    });
    (0, vitest_1.it)('Ten Tales is earned by the tenth, on its day', function () {
        var tasks = Array.from({ length: 10 }, function (_, i) { return won("2026-10-".concat(String(10 + i).padStart(2, '0'), "T12:00:00+01:00"), 'light'); });
        (0, vitest_1.expect)(badge([record(tasks.slice(0, 9))], 'tenTales')).toMatchObject({ have: 9, earnedOn: null });
        (0, vitest_1.expect)(badge([record(tasks)], 'tenTales')).toMatchObject({ have: 10, earnedOn: '2026-10-19' });
    });
    (0, vitest_1.it)('Dragon Slayer counts only Hard', function () {
        var hard = Array.from({ length: 5 }, function (_, i) { return won("2026-10-1".concat(i, "T12:00:00+01:00"), 'hard'); });
        (0, vitest_1.expect)(badge([record(hard.slice(0, 4))], 'dragonSlayer')).toMatchObject({ have: 4, earnedOn: null });
        (0, vitest_1.expect)(badge([record(hard)], 'dragonSlayer').earnedOn).toBe('2026-10-14');
    });
    (0, vitest_1.it)("Saga's End needs the saga and every chapter", function () {
        var saga = won('2026-10-20T12:00:00+01:00', 'light', { id: 'saga' });
        var chapter = won('2026-10-21T12:00:00+01:00', 'light', { parentId: 'saga' });
        var open = __assign(__assign({}, chapter), { id: 'open', state: 'queued', finished: null });
        (0, vitest_1.expect)(badge([record([saga, chapter])], 'sagasEnd').earnedOn).toBe('2026-10-21');
        (0, vitest_1.expect)(badge([record([saga, chapter, open])], 'sagasEnd').earnedOn).toBe(null);
        (0, vitest_1.expect)(badge([record([saga])], 'sagasEnd').earnedOn).toBe(null);
    });
    (0, vitest_1.it)('Week of Fire needs seven days in a row', function () {
        var tasks = Array.from({ length: 7 }, function (_, i) { return won("2026-10-1".concat(i, "T12:00:00+01:00"), 'light'); });
        (0, vitest_1.expect)(badge([record(tasks.slice(0, 6))], 'weekOfFire')).toMatchObject({ have: 6, earnedOn: null });
        (0, vitest_1.expect)(badge([record(tasks)], 'weekOfFire').earnedOn).toBe('2026-10-16');
    });
});
(0, vitest_1.describe)('the game only reads', function () {
    (0, vitest_1.it)('leaves every record byte for byte the same', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, file, text, read, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-game-'))];
                case 1:
                    dir = _c.sent();
                    file = (0, node_path_1.join)(dir, 'p.json');
                    text = JSON.stringify(AS_OF_27_OCT[0], null, 2);
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, text)];
                case 2:
                    _c.sent();
                    _a = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    read = _a.apply(void 0, [_c.sent()]);
                    if (read === 'unreadable')
                        throw new Error('should read');
                    (0, game_1.gameOf)([read], 60, NOW);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(text);
                    return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true, force: true })];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
