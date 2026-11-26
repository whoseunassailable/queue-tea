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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var en_1 = require("../../../l10n/en");
var test_profile_control_1 = require("./widgets/test_profile_control");
(0, vitest_1.afterEach)(preact_1.cleanup);
var chip = function (id) { return preact_1.screen.getByRole('button', { name: en_1.t.testProfile.names[id] }); };
var pressed = function () { return preact_1.screen.getAllByRole('button').filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).map(function (b) { return b.textContent; }); };
var show = function (profile, onChange) {
    if (onChange === void 0) { onChange = vitest_1.vi.fn(); }
    (0, preact_1.render)(<test_profile_control_1.TestProfileControl profile={profile} onChange={onChange}/>);
    return onChange;
};
(0, vitest_1.describe)('the test profile control', function () {
    (0, vitest_1.it)('offers the five profiles, lightest first, and with none picked says Tea-DD will pick', function () {
        show(null);
        (0, vitest_1.expect)(preact_1.screen.getByRole('group', { name: en_1.t.testProfile.label })).toBeTruthy();
        (0, vitest_1.expect)(preact_1.screen.getAllByRole('button').map(function (b) { return b.textContent; })).toEqual(['Quick', 'Standard', 'Deep', 'Critical', 'Release']);
        (0, vitest_1.expect)(pressed()).toEqual([]);
        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.testProfile.none)).toBeTruthy();
    });
    (0, vitest_1.it)("shows Tea-DD's pick pressed, with its reason and what the profile runs", function () {
        show({ id: 'deep', by: 'tea-dd', reason: 'a stored field old records must still read' });
        (0, vitest_1.expect)(pressed()).toEqual(['Deep']);
        (0, vitest_1.expect)(preact_1.screen.getByText(new RegExp("Tea-DD chose Deep: a stored field old records must still read ".concat(en_1.t.testProfile.runs.deep)))).toBeTruthy();
    });
    (0, vitest_1.it)("shows Rohan's pick as his, and how to hand it back", function () {
        show({ id: 'critical', by: 'rohan' });
        (0, vitest_1.expect)(pressed()).toEqual(['Critical']);
        (0, vitest_1.expect)(preact_1.screen.getByText(new RegExp(en_1.t.testProfile.rohans('Critical').replace(/[.;?]/g, '\\$&')))).toBeTruthy();
    });
    (0, vitest_1.it)("pressing a profile saves it as Rohan's, over Tea-DD's, and says it is saving until the save ends", function () { return __awaiter(void 0, void 0, void 0, function () {
        var finish, onChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finish = function () { };
                    onChange = vitest_1.vi.fn(function () { return new Promise(function (resolve) { return (finish = resolve); }); });
                    show({ id: 'standard', by: 'tea-dd', reason: 'one feature' }, onChange);
                    preact_1.fireEvent.click(chip('release'));
                    (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('release');
                    (0, vitest_1.expect)(pressed()).toEqual(['Release']);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('status').textContent).toContain(en_1.t.testProfile.saving);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, finish()];
                        }); }); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('status')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("pressing Tea-DD's own pick makes it Rohan's, not a clear", function () {
        var onChange = show({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
        preact_1.fireEvent.click(chip('deep'));
        (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('deep');
    });
    (0, vitest_1.it)("pressing Rohan's pick again lets Tea-DD pick", function () {
        var onChange = show({ id: 'quick', by: 'rohan' });
        preact_1.fireEvent.click(chip('quick'));
        (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(null);
        (0, vitest_1.expect)(pressed()).toEqual([]);
    });
    (0, vitest_1.it)("pressing another profile while Rohan's stands swaps his pick", function () {
        var onChange = show({ id: 'quick', by: 'rohan' });
        preact_1.fireEvent.click(chip('standard'));
        (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('standard');
    });
    (0, vitest_1.it)('a save that did not take shows the saved profile again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false })];
                    }); }); });
                    show({ id: 'deep', by: 'tea-dd', reason: 'a new tool' }, onChange);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                preact_1.fireEvent.click(chip('quick'));
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pressed()).toEqual(['Deep']);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('status')).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByText(/Tea-DD chose Deep: a new tool/)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
