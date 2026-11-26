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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeEngine = exports.helperJob = exports.MANA = exports.LIBRARY = exports.note = exports.NOTES = exports.DESIGNS = exports.SETTINGS_PAGE = exports.QUEST_FACTS = exports.CHRONICLE = exports.victoryLine = exports.HOARD = exports.GAME = exports.projectView = exports.projectRow = exports.VICTORY = exports.activeQuest = exports.quest = void 0;
var test_fixtures_1 = require("./features/branches/test_fixtures");
var vitest_1 = require("vitest");
var quest = function (over) { return (__assign({ title: over.id, priority: 'mid', difficulty: 'medium', xp: 25, estimateMinutes: 90, waitedMs: 86400000 * 6, why: null, isStar: false, isPlayNext: false, parentId: null, sealedBecause: null, branch: null, created: '2026-10-20T09:00:00+02:00', description: null, criteria: [], fits: null, goal: null, acceptance: [], helpers: ['tea-dd'], testProfile: null, due: null }, over)); };
exports.quest = quest;
var activeQuest = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'active', title: 'Active one', priority: 'high', difficulty: 'hard', xp: 50, branch: 'task/active', minutes: 14, started: '2026-10-27T16:00:00+01:00', isBoss: false, improvingMessages: 1, filesChanged: 2, review: null, criteria: [], helpers: ['tea-dd'], testProfile: null, due: null, testingMinutes: 0, minutesInChecks: 0, asking: null, codexSince: null, worktreePath: null, baseBranch: null, parentId: null }, over));
};
exports.activeQuest = activeQuest;
exports.VICTORY = {
    kind: 'quest',
    title: 'Active one',
    actual: 'hard',
    expected: 'hard',
    xp: 50,
    gold: 50,
    level: 2,
    didLevelUp: false,
    xpIntoLevel: 70,
    xpToNextLevel: 200,
    nextLevelAt: 300,
    hoard: 170,
    stage: 'hatchling',
    newBadges: [],
};
var projectRow = function (key, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ kind: 'readable', key: key, name: key.split('-')[0], path: "/p/".concat(key), waiting: 0, status: { kind: 'nothing' }, session: 'none' }, over));
};
exports.projectRow = projectRow;
var projectView = function (key, over) {
    var _a;
    if (over === void 0) { over = {}; }
    return (__assign({ kind: 'readable', key: key, name: key.split('-')[0], path: "/p/".concat(key), session: { state: 'none', allowance: null }, active: null, activeQuests: (_a = over.activeQuests) !== null && _a !== void 0 ? _a : (over.active ? [over.active] : []), branches: [], ready: [], sealed: [], canStart: 0, sealedCount: 0, activeSaga: null, activeSagaId: null, victories: [], victoryCount: 0, docsLogPath: 'docs/task_log.md', budget: null }, over));
};
exports.projectView = projectView;
exports.GAME = {
    victories: 5,
    xp: 120,
    gold: 120,
    level: 2,
    xpIntoLevel: 20,
    xpToNextLevel: 200,
    stage: 'hatchling',
    streak: 1,
    bestStreak: 3,
    wonToday: true,
    badges: [{ id: 'firstFlame', need: 1, have: 1, earnedOn: '2026-10-20' }],
    allowance: { percent: 62, resetsAt: null },
};
var _allowance = exports.GAME.allowance, GAME_ONLY = __rest(exports.GAME, ["allowance"]);
exports.HOARD = { game: GAME_ONLY, realms: [{ key: 'a-000001', name: 'queue-tea', victories: 4, gold: 95 }, { key: 'b-000002', name: 'Gait-feedback', victories: 1, gold: 25 }], unreadable: 0 };
var WEEK = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'];
var empty = function (day) { return ({ day: day, onQuests: 0, elsewhere: 0 }); };
var victoryLine = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'won', title: 'Short branch names', priority: 'urgent', realm: 'queue-tea', realmPath: '/p/a-000001', started: '2026-10-22T15:58:00+02:00', finished: '2026-10-22T16:23:00+02:00', minutes: 25, expected: 'hard', actual: 'medium', xp: 25, improvingMessages: 6, filesRead: 2, filesChanged: 16, linesAdded: 958, linesRemoved: 799, filesTouched: 27, branch: 'task/short-branch', startCommit: 'c1fc0351234' }, over));
};
exports.victoryLine = victoryLine;
exports.CHRONICLE = {
    days: WEEK.map(function (day, i) { return (i === 3 ? { day: day, onQuests: 54, elsewhere: 77 } : empty(day)); }),
    victories: [(0, exports.victoryLine)()],
    minutes: 131,
    onQuests: 54,
    elsewhere: 77,
    asExpected: 0,
    harder: 0,
    easier: 1,
    xp: 25,
    lastWeek: { victories: 2, minutes: 300 },
    hasAny: true,
    isThisWeek: true,
    unreadable: 0,
};
exports.QUEST_FACTS = { note: null, messages: [], branchToBe: null, active: null, activity: { step: null, commits: [], gitUnavailable: false } };
exports.SETTINGS_PAGE = {
    options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
    isDefault: true,
    realm: { key: 'a-000001', name: 'a', path: '/p/a-000001', file: 'a-000001.json', hasCopy: true, logPath: 'notes/log.md', gitMode: 'assisted', isReadable: true },
    command: null,
};
exports.DESIGNS = { versions: [], coming: [] };
exports.NOTES = { notes: [], unreadable: [], folder: '/Users/me/.queue-tea/notes/a-000001' };
var note = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'n-00000001', title: 'Bug Bounty Helper', folder: 'Ideas', type: null, isPinned: false, tags: [], created: '2026-11-07T10:00:00+01:00', updated: '2026-11-07T10:00:00+01:00', isArchived: false, quests: [], body: '', stamp: 's-1' }, over));
};
exports.note = note;
exports.LIBRARY = { reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0 };
exports.MANA = {
    realm: 'queue-tea',
    today: { day: '2026-10-27', onQuests: 19, elsewhere: 118 },
    days: WEEK.map(function (day, i) { return (i === 0 ? { day: day, onQuests: 19, elsewhere: 118 } : empty(day)); }),
    weekMinutes: 137,
    lastWeekMinutes: 354,
    victories: 0,
    inProgress: 1,
    active: { title: 'The boss', isBoss: true, minutes: 43, understandingMessages: 0, improvingMessages: 4, filesRead: 33, filesChanged: 39 },
    byQuest: [{ title: 'The boss', minutes: 19 }],
    elsewhere: 118,
    allowance: { percent: 62, resetsAt: null, seenAt: Date.parse('2026-10-27T17:48:00'), isStale: false },
    options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
    lines: { added: 812, removed: 95, since: '1649ade' },
};
var reply = function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true, data: (0, exports.projectView)(key) })];
}); }); };
var helperJob = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ helper: 'tea-dd', realm: 'a-000001', folder: '/p/a-000001', order: 'Write tests for the timer', merge: null, status: 'working', doing: null, steps: 0, reply: null, error: null, started: Date.parse('2026-10-27T17:50:00Z'), finished: null }, over));
};
exports.helperJob = helperJob;
// An engine held in memory. A test swaps any call, and `fire` plays a change.
var fakeEngine = function (over) {
    if (over === void 0) { over = {}; }
    var listeners = new Set();
    var helperListeners = new Set();
    var engine = __assign({ readAppUpdate: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle', commit: null, detail: null }, canRetry: false, canRestart: false } })];
        }); }); }, applyAppUpdate: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle', commit: null, detail: null }, canRetry: false, canRestart: false } })];
        }); }); }), listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [(0, exports.projectRow)('a-000001')] })];
        }); }); }, readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, exports.projectView)(key) })];
        }); }); }, readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.GAME })];
        }); }); }, readHoard: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.HOARD })];
        }); }); }, readChronicle: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.CHRONICLE })];
        }); }); }), readMana: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.MANA })];
        }); }); }), readDesigns: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.DESIGNS })];
        }); }); }), readDesignVersion: vitest_1.vi.fn(function (_key, folder) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { folder: folder, label: folder, designs: [], comments: [], commentsProblem: null, uncommitted: 0 } })];
        }); }); }), readDesign: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: false, error: { message: 'No design in this test.' } })];
        }); }); }), saveDesign: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'saved', stamp: 'saved', at: 0 } })];
        }); }); }), saveDesignCopy: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: 'copy' })];
        }); }); }), restoreDesignFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), addDesignComment: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); }), setDesignComment: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); }), sendDesignComments: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), setDesignApproval: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), showDesigns: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
        }); }); }, saveSettings: vitest_1.vi.fn(function (patch) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: __assign({ sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} }, patch) })];
        }); }); }), readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.SETTINGS_PAGE })];
        }); }); }, setTaskLog: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), setGitMode: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), showRecord: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), openFolder: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), addProject: vitest_1.vi.fn(function (path) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: path })];
        }); }); }), restoreRealm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: 'kept.json' })];
        }); }); }), installCommand: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { path: '/usr/local/bin/queue-tea', needsPath: false } })];
        }); }); }), readGithub: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'ready', accounts: [] } })];
        }); }); }), startGithubLogin: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { code: 'AAAA-BBBB', url: 'https://github.com/login/device' } })];
        }); }); }), openGithubLogin: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), awaitGithubLogin: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: { kind: 'ready', accounts: [] }, added: null } })];
        }); }); }), cancelGithubLogin: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), readLibrary: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.LIBRARY })];
        }); }); }), addBook: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.LIBRARY })];
        }); }); }), setBookPage: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.LIBRARY })];
        }); }); }), finishBook: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.LIBRARY })];
        }); }); }), removeBook: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.LIBRARY })];
        }); }); }), readNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.NOTES })];
        }); }); }), readNoteHistory: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); }), readNoteVersion: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: false, error: { message: 'No note version in this test.' } })];
        }); }); }), restoreNoteVersion: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: false, error: { message: 'No note version in this test.' } })];
        }); }); }), attachNoteFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { path: 'attachments/photo.png', kind: 'image' } })];
        }); }); }), readNoteFile: vitest_1.vi.fn(function (_key, path) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { path: path, kind: (path.endsWith('.pdf') ? 'pdf' : path.endsWith('.png') ? 'image' : 'other') } })];
        }); }); }), downloadNoteFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: true })];
        }); }); }), showNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), exportNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { folder: 'Notes backup demo-abc123 2026-11-17', notes: 2, files: 1, skipped: [] } })];
        }); }); }), restoreNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: exports.NOTES, added: 1, renamed: 0, same: 1, toHistory: 0, files: 1, skipped: [] } })];
        }); }); }), openLink: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), readBookmark: vitest_1.vi.fn(function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { url: url, title: 'Example page', description: 'What the page is about.', site: 'Example' } })];
        }); }); }), readCanvas: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { canvas: { nodes: [], edges: [] }, stamp: null } })];
        }); }); }), saveCanvas: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'saved', stamp: 'c-2' } })];
        }); }); }), readCalendar: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { events: [], unreadable: 0 } })];
        }); }); }), saveCalendarEvent: vitest_1.vi.fn(function (_key, id, event) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { events: [__assign({ id: id !== null && id !== void 0 ? id : 'e-1' }, event)], unreadable: 0 } })];
        }); }); }), removeCalendarEvent: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { events: [], unreadable: 0 } })];
        }); }); }), createNote: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: exports.NOTES, id: 'n-00000001' } })];
        }); }); }), saveNote: vitest_1.vi.fn(function (_key, id, change) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'saved', view: exports.NOTES, note: (0, exports.note)(__assign(__assign({ id: id }, change), { stamp: 's-2' })), relinked: 0 } })];
        }); }); }), archiveNote: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.NOTES })];
        }); }); }), renameFolder: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.NOTES })];
        }); }); }), deleteNote: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.NOTES })];
        }); }); }), fileNoteQuests: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: exports.NOTES, project: (0, exports.projectView)(key) } })];
        }); }); }), takeOpened: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); }, readChoices: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { features: [], lone: [], parents: [], waitFor: [] } })];
        }); }); }, setPriority: vitest_1.vi.fn(reply), togglePlayNext: vitest_1.vi.fn(reply), fileQuest: vitest_1.vi.fn(reply), moveQuest: vitest_1.vi.fn(reply), sealQuest: vitest_1.vi.fn(reply), unsealQuest: vitest_1.vi.fn(reply), removeQuest: vitest_1.vi.fn(reply), restoreQuest: vitest_1.vi.fn(reply), editQuest: vitest_1.vi.fn(reply), setActiveSaga: vitest_1.vi.fn(reply), setTimeBudget: vitest_1.vi.fn(reply), readQuestFacts: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: exports.QUEST_FACTS })];
        }); }); }), readLive: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { drift: [], mismatch: null, warning: null } })];
        }); }); }), switchBranch: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), readBranches: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, (0, test_fixtures_1.branchGraph)()), { tasks: [] }) })];
        }); }); }), readBranch: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)() })];
        }); }); }), readMergeWorkspace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), prepareMerge: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), resolveMergeFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), completeMerge: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), abandonMerge: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), runMergeChecks: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), cancelMergeChecks: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), openMergeFolder: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), commitBranchFiles: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)() })];
        }); }); }), readPush: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: false, error: { message: 'Remote unavailable.' } })];
        }); }); }), pushMerge: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)() })];
        }); }); }), readFolderSpace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { at: 0, folders: [] } })];
        }); }); }), freeFolderSpace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { at: 0, folders: [] } })];
        }); }); }), removeTaskFolder: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { at: 0, folders: [] } })];
        }); }); }), checkStart: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'clear', step: { kind: 'make', branch: 'task/first', from: 'main' } } })];
        }); }); }), startQuest: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'started', view: (0, exports.projectView)(key), branch: 'task/first', notice: null, handover: { kind: 'session' } } })];
        }); }); }), openClaude: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'opened', terminal: 'terminal' } })];
        }); }); }), continueIn: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: (0, exports.projectView)(key), handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false } })];
        }); }); }), notYet: vitest_1.vi.fn(reply), finishQuest: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: (0, exports.projectView)(key), logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: exports.VICTORY, isCodexTimeLost: false } })];
        }); }); }), retryTaskLog: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: (0, exports.projectView)(key), logPath: 'docs/task_log.md', logFailedAt: null } })];
        }); }); }), putBackQuest: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: (0, exports.projectView)(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: false } })];
        }); }); }), putBackNow: vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { view: (0, exports.projectView)(key), went: 'back', missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } })];
        }); }); }), copyText: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), readHelpers: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); }, sendHelper: vitest_1.vi.fn(function (key, helper, order) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, exports.helperJob)({ realm: key, helper: helper, order: order }) })];
        }); }); }), concileMerge: vitest_1.vi.fn(function (key, helper, operationId) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, exports.helperJob)({ realm: key, helper: helper, merge: operationId, order: 'Resolve the conflicts' }) })];
        }); }); }), stopHelper: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: null })];
        }); }); }), onHelpers: function (listener) {
            helperListeners.add(listener);
            return function () { return helperListeners.delete(listener); };
        }, onChange: function (listener) {
            listeners.add(listener);
            return function () { return listeners.delete(listener); };
        }, onMenu: function () { return function () { }; }, onOpened: function () { return function () { }; }, log: vitest_1.vi.fn() }, over);
    return { engine: engine, fire: function () { return listeners.forEach(function (listener) { return listener(); }); }, tellHelpers: function (jobs) { return helperListeners.forEach(function (listener) { return listener(jobs); }); } };
};
exports.fakeEngine = fakeEngine;
