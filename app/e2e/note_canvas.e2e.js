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
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'board-abc123';
var home;
var app;
var page;
var boardFile = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/notes', KEY, 'Canvas.canvas'), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var cardOf = function (board, file) { return board.nodes.find(function (node) { return node.file === file; }); };
var zoom = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = Number;
            return [4 /*yield*/, page.locator('.nc-zoom .sub').textContent()];
        case 1: return [2 /*return*/, _a.apply(void 0, [(_b.sent()).replace('%', '')]) / 100];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var notes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-canvas-'))];
            case 1:
                home = _a.sent();
                notes = (0, node_path_1.join)(home, '.queue-tea/notes', KEY);
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'project'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(notes, { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Board notes', path: (0, node_path_1.join)(home, 'project') }, tasks: [], requests: [] }))];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(notes, 'Alpha.md'), '---\ntitle: Alpha\n---\nThe first idea.')];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(notes, 'Beta.md'), '---\ntitle: Beta\n---\nThe second idea.')
                    // A board as Obsidian leaves it: a coloured group and a text card, which must come back as they were.
                ];
            case 7:
                _a.sent();
                // A board as Obsidian leaves it: a coloured group and a text card, which must come back as they were.
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(notes, 'Canvas.canvas'), JSON.stringify({ nodes: [{ id: 'g1', type: 'group', label: 'Week 1', color: '4', x: -40, y: -60, width: 800, height: 400 }, { id: 'a1', type: 'file', file: 'Alpha.md', x: 0, y: 0, width: 280, height: 160 }, { id: 't1', type: 'text', text: 'Ask the clinic', x: 0, y: 200, width: 240, height: 80 }], edges: [] }, null, '\t'))];
            case 8:
                // A board as Obsidian leaves it: a coloured group and a text card, which must come back as they were.
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 9:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 10:
                page = _a.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Board notes/ }).click()];
            case 12:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 13:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).not.toHaveValue('')];
            case 14:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Canvas', exact: true }).click()];
            case 15:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Canvas: 3 cards, 0 lines' })).toBeVisible()];
            case 16:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test_1.test.afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (page === null || page === void 0 ? void 0 : page.close())];
            case 1:
                _a.sent();
                return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a note added from the list lands on the board and in the file', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Add note or quest…' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByLabel('Find a note or a quest').fill('bet')];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Beta, note in Inbox' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('group', { name: 'note Beta' })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; var _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = cardOf;
                                return [4 /*yield*/, boardFile()];
                            case 1: return [2 /*return*/, (_b = _a.apply(void 0, [_c.sent(), 'Beta.md'])) === null || _b === void 0 ? void 0 : _b.type];
                        }
                    }); }); }).toBe('file')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('dragging a card moves it, dragging its corner resizes it, and each saves once let go', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a, scale, alpha, box, _b, _c, moved;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = cardOf;
                return [4 /*yield*/, boardFile()];
            case 1:
                before = _a.apply(void 0, [_d.sent(), 'Alpha.md']);
                return [4 /*yield*/, zoom()];
            case 2:
                scale = _d.sent();
                alpha = page.getByRole('group', { name: 'note Alpha' });
                return [4 /*yield*/, alpha.boundingBox()];
            case 3:
                box = (_d.sent());
                return [4 /*yield*/, page.mouse.move(box.x + box.width / 2, box.y + box.height - 20)];
            case 4:
                _d.sent();
                return [4 /*yield*/, page.mouse.down()
                    // Right, clear of Beta, which landed over Alpha's corner and would take the resize.
                ];
            case 5:
                _d.sent();
                // Right, clear of Beta, which landed over Alpha's corner and would take the resize.
                return [4 /*yield*/, page.mouse.move(box.x + box.width / 2 + 300, box.y + box.height, { steps: 6 })];
            case 6:
                // Right, clear of Beta, which landed over Alpha's corner and would take the resize.
                _d.sent();
                return [4 /*yield*/, page.mouse.up()];
            case 7:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = cardOf;
                                return [4 /*yield*/, boardFile()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), 'Alpha.md']).x];
                        }
                    }); }); }).toBeCloseTo(before.x + 300 / scale, -1)];
            case 8:
                _d.sent();
                _b = test_1.expect;
                _c = cardOf;
                return [4 /*yield*/, boardFile()];
            case 9:
                _b.apply(void 0, [_c.apply(void 0, [_d.sent(), 'Alpha.md']).y]).toBeCloseTo(before.y + 20 / scale, -1);
                return [4 /*yield*/, alpha.boundingBox()];
            case 10:
                moved = (_d.sent());
                return [4 /*yield*/, page.mouse.move(moved.x + moved.width - 4, moved.y + moved.height - 4)];
            case 11:
                _d.sent();
                return [4 /*yield*/, page.mouse.down()];
            case 12:
                _d.sent();
                return [4 /*yield*/, page.mouse.move(moved.x + moved.width + 56, moved.y + moved.height + 26, { steps: 6 })];
            case 13:
                _d.sent();
                return [4 /*yield*/, page.mouse.up()];
            case 14:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = cardOf;
                                return [4 /*yield*/, boardFile()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), 'Alpha.md']).width];
                        }
                    }); }); }).toBeCloseTo(before.width + 60 / scale, -1)];
            case 15:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Connect, then another card, draws a line between them, and Delete on the line removes it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a, _i, _b, _, alpha, width, beta, line, _c, edges, nodes;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = cardOf;
                return [4 /*yield*/, boardFile()];
            case 1:
                before = _a.apply(void 0, [_d.sent(), 'Beta.md']).x;
                return [4 /*yield*/, page.getByRole('group', { name: 'note Beta' }).focus()];
            case 2:
                _d.sent();
                _i = 0, _b = [1, 2, 3];
                _d.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 6];
                _ = _b[_i];
                return [4 /*yield*/, page.keyboard.press('Shift+ArrowLeft')];
            case 4:
                _d.sent();
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = cardOf;
                            return [4 /*yield*/, boardFile()];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), 'Beta.md']).x];
                    }
                }); }); }).toBe(before - 240)];
            case 7:
                _d.sent();
                alpha = page.getByRole('group', { name: 'note Alpha' });
                return [4 /*yield*/, alpha.boundingBox()];
            case 8:
                width = (_d.sent()).width;
                return [4 /*yield*/, alpha.hover({ position: { x: width - 30, y: 40 } })];
            case 9:
                _d.sent();
                return [4 /*yield*/, alpha.getByRole('button', { name: 'Connect note Alpha to another card' }).click()];
            case 10:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Pick the card to connect note Alpha to. Esc cancels.')).toBeVisible()];
            case 11:
                _d.sent();
                return [4 /*yield*/, page.getByRole('group', { name: 'note Beta' }).boundingBox()];
            case 12:
                beta = (_d.sent());
                return [4 /*yield*/, page.mouse.click(beta.x + beta.width / 2, beta.y + beta.height - 20)];
            case 13:
                _d.sent();
                line = page.getByRole('button', { name: 'Line from note Alpha to note Beta. Delete removes it.' });
                return [4 /*yield*/, (0, test_1.expect)(line).toBeAttached()];
            case 14:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boardFile()];
                            case 1: return [2 /*return*/, (_a.sent()).edges.length];
                        }
                    }); }); }).toBe(1)];
            case 15:
                _d.sent();
                return [4 /*yield*/, boardFile()];
            case 16:
                _c = _d.sent(), edges = _c.edges, nodes = _c.nodes;
                (0, test_1.expect)(edges[0]).toMatchObject({ fromNode: nodes.find(function (node) { return node.file === 'Alpha.md'; }).id, toNode: nodes.find(function (node) { return node.file === 'Beta.md'; }).id, fromSide: test_1.expect.any(String), toSide: test_1.expect.any(String) });
                return [4 /*yield*/, page.screenshot({ path: test_1.test.info().outputPath('canvas.png') })];
            case 17:
                _d.sent();
                return [4 /*yield*/, line.focus()];
            case 18:
                _d.sent();
                return [4 /*yield*/, page.keyboard.press('Delete')];
            case 19:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, boardFile()];
                            case 1: return [2 /*return*/, (_a.sent()).edges.length];
                        }
                    }); }); }).toBe(0)];
            case 20:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)("Obsidian's group and text card come back as they were, and the board is the same after leaving it", function () { return __awaiter(void 0, void 0, void 0, function () {
    var board, left;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, boardFile()];
            case 1:
                board = _a.sent();
                (0, test_1.expect)(board.nodes.find(function (node) { return node.id === 'g1'; })).toEqual({ id: 'g1', type: 'group', label: 'Week 1', color: '4', x: -40, y: -60, width: 800, height: 400 });
                (0, test_1.expect)(board.nodes.find(function (node) { return node.id === 't1'; })).toEqual({ id: 't1', type: 'text', text: 'Ask the clinic', x: 0, y: 200, width: 240, height: 80 });
                return [4 /*yield*/, page.getByRole('group', { name: 'note Alpha' }).evaluate(function (card) { return card.style.left; })];
            case 2:
                left = _a.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Beta/ }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Beta')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Canvas', exact: true }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('group', { name: 'note Alpha' })).toHaveCSS('left', left)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
