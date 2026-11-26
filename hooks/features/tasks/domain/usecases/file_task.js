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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileTaskUseCase = void 0;
var families_1 = require("../../../../shared/backlog/domain/services/families");
var helpers_1 = require("../../../../shared/records/domain/services/helpers");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
// Saves a held message as a task: on its own, under a feature, or under a new
// feature filed with it. A failed write throws.
var fileTaskUseCase = function (d, ctx, input) { return __awaiter(void 0, void 0, void 0, function () {
    var pick, now, _a, feature, task, refused, saved;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                pick = (_b = input.parent) !== null && _b !== void 0 ? _b : { kind: 'none' };
                _a = time_1.isoLocal;
                return [4 /*yield*/, d.env.now()];
            case 1:
                now = _a.apply(void 0, [_f.sent(), ctx.offsetMinutes]);
                feature = pick.kind === 'new'
                    ? (0, queue_rules_1.newTask)({ title: pick.title.trim(), priority: input.priority, difficulty: 'medium', messages: [], now: now, id: d.env.newId() })
                    : null;
                task = __assign(__assign(__assign({}, (0, queue_rules_1.newTask)({
                    title: input.title,
                    priority: input.priority,
                    difficulty: input.difficulty,
                    messages: [input.text],
                    now: now,
                    id: d.env.newId(),
                    parentId: pick.kind === 'task' ? pick.id : ((_c = feature === null || feature === void 0 ? void 0 : feature.id) !== null && _c !== void 0 ? _c : null),
                })), { description: (_d = input.description) !== null && _d !== void 0 ? _d : null, criteria: (_e = input.criteria) !== null && _e !== void 0 ? _e : [] }), (input.helpers === undefined ? {} : { helpers: __assign(__assign({}, (0, helpers_1.defaultHelpers)()), { on: (0, helpers_1.onlyHelpers)(input.helpers) }) }));
                refused = null;
                return [4 /*yield*/, d.records.update(function (r) {
                        refused = pick.kind === 'task' ? (0, families_1.parentRefusal)(r.tasks, task.id, pick.id) : null;
                        return refused === null ? __assign(__assign({}, r), { tasks: __spreadArray(__spreadArray(__spreadArray([], r.tasks, true), (feature === null ? [] : [feature]), true), [task], false) }) : r;
                    })];
            case 2:
                saved = _f.sent();
                if (saved === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                if (refused !== null)
                    return [2 /*return*/, { kind: 'refused', notice: "".concat(refused, " Pick again."), record: saved }];
                return [2 /*return*/, { kind: 'filed', task: task, parent: (0, families_1.parentOf)(task, saved.tasks), record: saved }];
        }
    });
}); };
exports.fileTaskUseCase = fileTaskUseCase;
