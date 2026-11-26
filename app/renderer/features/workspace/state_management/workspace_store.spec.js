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
var vitest_1 = require("vitest");
var test_support_1 = require("../../../test_support");
var workspace_store_1 = require("./workspace_store");
var fail = function (message) { return ({ ok: false, error: { message: message } }); };
(0, vitest_1.describe)('the workspace', function () {
    (0, vitest_1.it)('opens the only realm there is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)().engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState()).toMatchObject({ selected: 'a-000001', project: { status: 'ready' }, game: { status: 'ready' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the last realm used', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({
                        listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)('a-000001'), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); },
                        readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { sky: 'auto', isCalm: false, lastProject: 'b-000002', folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                        }); }); },
                    }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState().selected).toBe('b-000002');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with several realms and no memory, lets the list ask', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)('a-000001'), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); } }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState()).toMatchObject({ selected: null, project: { status: 'none' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a first load that fails shows the failed state, and Try again recovers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isDown, engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isDown = true;
                    engine = (0, test_support_1.fakeEngine)({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (isDown ? fail('plain') : { ok: true, data: [(0, test_support_1.projectRow)('a-000001')] })];
                        }); }); } }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState().projects).toEqual({ status: 'failed', message: 'plain' });
                    isDown = false;
                    return [4 /*yield*/, workspace.refresh()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState().projects.status).toBe('ready');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a refresh that fails keeps what is on screen and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var isDown, _a, engine, fire, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isDown = false;
                    _a = (0, test_support_1.fakeEngine)({ readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (isDown ? fail('plain') : { ok: true, data: (0, test_support_1.projectView)(key) })];
                        }); }); } }), engine = _a.engine, fire = _a.fire;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _b.sent();
                    isDown = true;
                    fire();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(workspace.getState().note).toBe('plain'); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().project.status).toBe('ready');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a change on disk reads everything again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readGame, _a, engine, fire, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readGame = vitest_1.vi.fn((0, test_support_1.fakeEngine)().engine.readGame);
                    _a = (0, test_support_1.fakeEngine)({ readGame: readGame }), engine = _a.engine, fire = _a.fire;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _b.sent();
                    fire();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(readGame).toHaveBeenCalledTimes(2); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a slow read of the old realm cannot paint over a switch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishSlow, engine, workspace, slow, project;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finishSlow = function () { };
                    engine = (0, test_support_1.fakeEngine)({
                        listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)('a-000001'), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); },
                        readProject: function (key) { return (key === 'a-000001' ? new Promise(function (done) { return (finishSlow = done); }) : Promise.resolve({ ok: true, data: (0, test_support_1.projectView)(key) })); },
                    }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    slow = workspace.pick('a-000001');
                    return [4 /*yield*/, workspace.pick('b-000002')];
                case 2:
                    _a.sent();
                    finishSlow({ ok: true, data: (0, test_support_1.projectView)('a-000001') });
                    return [4 /*yield*/, slow];
                case 3:
                    _a.sent();
                    project = workspace.getState().project;
                    (0, vitest_1.expect)(project.status === 'ready' && project.data.key).toBe('b-000002');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('remembers a picked realm and a picked sky', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)('a-000001'), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); } }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, workspace.pick('b-000002')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, workspace.setSky('night')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'b-000002' });
                    (0, vitest_1.expect)(workspace.getState().settings.sky).toBe('night');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a setting that fails to save says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({ saveSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fail('not saved')];
                        }); }); } }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, workspace.setSky('night')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState().note).toBe('not saved');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('each realm keeps its own open quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            engine = (0, test_support_1.fakeEngine)().engine;
            workspace = (0, workspace_store_1.createWorkspace)(engine);
            workspace.openQuest('a-000001', 'x');
            workspace.openQuest('b-000002', 'y');
            (0, vitest_1.expect)(workspace.getState().openQuests).toEqual({ 'a-000001': 'x', 'b-000002': 'y' });
            return [2 /*return*/];
        });
    }); });
});
