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
exports.MENU = void 0;
exports.openMenu = openMenu;
exports.menuClosed = menuClosed;
exports.closeMenu = closeMenu;
var live_1 = require("../session/live");
// The tea cup's menu: a pane that asks for the keys, which the surface gives
// only over an empty prompt, and that Esc closes while it holds them. Inline
// it opens MENU_ROWS tall above the prompt; docked, MENU_COLUMNS wide.
exports.MENU = 'queue-tea';
var MENU_ROWS = 16;
var MENU_COLUMNS = 46;
function openMenu(p_1) {
    return __awaiter(this, arguments, void 0, function (p, view) {
        var name, opened;
        var _a, _b;
        if (view === void 0) { view = 'menu'; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = (_b = (_a = live_1.live.ctx) === null || _a === void 0 ? void 0 : _a.projectName) !== null && _b !== void 0 ? _b : 'this project';
                    return [4 /*yield*/, p.set('menuView', view)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, p.set('isMenuOpen', true)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, p.ui.open({
                            id: exports.MENU,
                            title: "Queue-tea \u00B7 ".concat(name),
                            focus: true,
                            closeOnEscape: true,
                            rows: MENU_ROWS,
                            columns: MENU_COLUMNS,
                        })];
                case 3:
                    opened = _c.sent();
                    if (!opened.isPlaced)
                        p.toast('Queue-tea: the terminal is too narrow for the menu here. Type /queue-tea to open it.');
                    return [2 /*return*/];
            }
        });
    });
}
// However it closed (Esc, its close mark, the cup), it opens on the list
// next time.
function menuClosed(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('isMenuOpen', false)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, p.set('menuView', 'menu')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function closeMenu(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.ui.close(exports.MENU)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, menuClosed(p)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
