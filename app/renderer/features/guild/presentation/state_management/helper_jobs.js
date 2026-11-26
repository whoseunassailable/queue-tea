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
exports.useHelperJobs = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
// What each helper is doing: read once, then kept current by main's pushes.
var useHelperJobs = function (engine) {
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readHelpers(); }, []);
    var adopt = read.adopt;
    (0, hooks_1.useEffect)(function () { return engine.onHelpers(adopt); }, [engine, adopt]);
    var jobs = read.load.status === 'ready' ? read.load.data : [];
    // The error to show, or null once the helper has the order.
    var send = function (key, helper, order) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.sendHelper(key, helper, order); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok)
                        return [2 /*return*/, answer.message
                            // Read again rather than patch the list: a push may have landed meanwhile.
                        ];
                    // Read again rather than patch the list: a push may have landed meanwhile.
                    read.refresh();
                    return [2 /*return*/, null];
            }
        });
    }); };
    // The error to show, or null once the helper is on its way to the merge.
    var concile = function (key, helper, mergeId) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.concileMerge(key, helper, mergeId); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok)
                        return [2 /*return*/, answer.message];
                    read.refresh();
                    return [2 /*return*/, null];
            }
        });
    }); };
    // The same order again: to the merge it was for, or to the realm.
    var retry = function (job) { return (job.merge === null ? send(job.realm, job.helper, job.order) : concile(job.realm, job.helper, job.merge)); };
    var stop = function (helper) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.stopHelper(helper); })];
                case 1:
                    answer = _a.sent();
                    return [2 /*return*/, answer.ok ? null : answer.message];
            }
        });
    }); };
    var jobOf = function (helper) { var _a; return (_a = jobs.find(function (job) { return job.helper === helper; })) !== null && _a !== void 0 ? _a : null; };
    return { read: read, jobs: jobs, jobOf: jobOf, send: send, concile: concile, retry: retry, stop: stop };
};
exports.useHelperJobs = useHelperJobs;
