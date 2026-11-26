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
var test_1 = require("@playwright/test");
var effort_tracker_1 = require("../../hooks/shared/effort/domain/services/effort_tracker");
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var time_1 = require("../../hooks/shared/time/domain/services/time");
var fixtures_1 = require("../main/features/tasks/api/fixtures");
var APP = (0, node_path_1.join)(__dirname, '..');
var MINUTE = 60000;
(0, test_1.test)('Realm totals merge parallel task work and survive restarting the app', function () { return __awaiter(void 0, void 0, void 0, function () {
    var home, app, offset_1, day_1, at_1, record, _i, _a, _b, id, start, end, tracker, time, folder, launch, page, _c, _d, id;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-realm-time-ui-'))];
            case 1:
                home = _e.sent();
                _e.label = 2;
            case 2:
                _e.trys.push([2, , 21, 24]);
                offset_1 = -new Date().getTimezoneOffset();
                day_1 = (0, time_1.dayKey)(Date.now(), offset_1);
                at_1 = function (hour) { return Date.parse("".concat(day_1, "T00:00:00Z")) + (hour * 60 - offset_1) * MINUTE; };
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('overlap', '/p/overlap')), { tasks: ['one', 'two'].map(function (id) { return (0, fixtures_1.makeTask)({ id: id, title: "Task ".concat(id), state: 'current', worktreePath: "/trees/".concat(id) }); }) });
                for (_i = 0, _a = [['one', 13, 16], ['two', 14, 17]]; _i < _a.length; _i++) {
                    _b = _a[_i], id = _b[0], start = _b[1], end = _b[2];
                    tracker = (0, effort_tracker_1.createTracker)(15, offset_1);
                    for (time = at_1(start); time <= at_1(end); time += 15 * MINUTE)
                        tracker.activity(time);
                    record = (0, effort_tracker_1.applyPending)(record, tracker.take(), undefined, { cwd: "/trees/".concat(id), projectPath: '/p/overlap' });
                }
                record.tasks = record.tasks.map(function (task) { return (__assign(__assign({}, task), { state: 'done', finished: new Date(at_1(17)).toISOString() })); });
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'overlap-abc123.json'), JSON.stringify(record))];
            case 4:
                _e.sent();
                launch = 0;
                _e.label = 5;
            case 5:
                if (!(launch < 2)) return [3 /*break*/, 20];
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 6:
                app = _e.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 7:
                page = _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^overlap/ }).click()];
            case 8:
                _e.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+6')];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[aria-labelledby="today-h"] .big')).toHaveText('4h 0m')];
            case 10:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[aria-labelledby="week-h"] .big')).toHaveText('4h 0m')];
            case 11:
                _e.sent();
                _c = 0, _d = ['one', 'two'];
                _e.label = 12;
            case 12:
                if (!(_c < _d.length)) return [3 /*break*/, 15];
                id = _d[_c];
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.bar-row').filter({ hasText: "Task ".concat(id) }).locator('.num')).toHaveText('3h 0m')];
            case 13:
                _e.sent();
                _e.label = 14;
            case 14:
                _c++;
                return [3 /*break*/, 12];
            case 15: return [4 /*yield*/, page.keyboard.press('Meta+5')];
            case 16:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.summary')).toContainText('4h 0m')];
            case 17:
                _e.sent();
                return [4 /*yield*/, app.close()];
            case 18:
                _e.sent();
                app = undefined;
                _e.label = 19;
            case 19:
                launch += 1;
                return [3 /*break*/, 5];
            case 20: return [3 /*break*/, 24];
            case 21: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 22:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 23:
                _e.sent();
                return [7 /*endfinally*/];
            case 24: return [2 /*return*/];
        }
    });
}); });
