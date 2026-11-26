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
exports.useEngineRead = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("./engine_client");
// One page's read: it runs when `deps` change and again whenever a record does.
// What's on screen stays through a refresh, and a refresh that fails says so
// beside it. Keep one request and one trailing refresh, so slow polling cannot
// build an unbounded queue. Parameter changes and adopted replies retire old data.
var useEngineRead = function (engine, read, deps) {
    var _a = (0, hooks_1.useState)({ status: 'loading' }), load = _a[0], setLoad = _a[1];
    var _b = (0, hooks_1.useState)(null), note = _b[0], setNote = _b[1];
    var _c = (0, hooks_1.useState)(false), isRefreshing = _c[0], setRefreshing = _c[1];
    var number = (0, hooks_1.useRef)(0);
    var mounted = (0, hooks_1.useRef)(false);
    var inFlight = (0, hooks_1.useRef)(false);
    var queued = (0, hooks_1.useRef)(false);
    var latest = (0, hooks_1.useRef)(read);
    var currentEngine = (0, hooks_1.useRef)(engine);
    latest.current = read;
    currentEngine.current = engine;
    var run = (0, hooks_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mine, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mounted.current)
                        return [2 /*return*/];
                    if (inFlight.current) {
                        queued.current = true;
                        return [2 /*return*/];
                    }
                    inFlight.current = true;
                    mine = number.current;
                    setRefreshing(true);
                    return [4 /*yield*/, (0, engine_client_1.ask)(currentEngine.current, function () { return latest.current(); })];
                case 1:
                    answer = _a.sent();
                    inFlight.current = false;
                    if (!mounted.current)
                        return [2 /*return*/];
                    if (mine === number.current) {
                        setRefreshing(false);
                        setNote(answer.ok ? null : answer.message);
                        setLoad(function (was) {
                            if (answer.ok)
                                return { status: 'ready', data: answer.data };
                            return was.status === 'ready' ? was : { status: 'failed', message: answer.message };
                        });
                    }
                    if (queued.current) {
                        queued.current = false;
                        void run();
                    }
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, hooks_1.useEffect)(function () {
        mounted.current = true;
        return function () { mounted.current = false; queued.current = false; number.current += 1; };
    }, []);
    (0, hooks_1.useEffect)(function () {
        number.current += 1;
        void run();
    }, __spreadArray([engine], deps, true));
    (0, hooks_1.useEffect)(function () { return engine.onChange(function () { return void run(); }); }, [engine, run]);
    var refresh = (0, hooks_1.useCallback)(function () { return void run(); }, [run]);
    // What a change handed back, with no need to read it again. A read still on
    // its way is older than this, so it no longer counts.
    var adopt = (0, hooks_1.useCallback)(function (data) {
        if (!mounted.current)
            return;
        number.current += 1;
        queued.current = false;
        setNote(null);
        setRefreshing(false);
        setLoad({ status: 'ready', data: data });
    }, []);
    var retry = function () {
        if (!mounted.current)
            return;
        setLoad({ status: 'loading' });
        void run();
    };
    return { load: load, note: note, isRefreshing: isRefreshing, retry: retry, refresh: refresh, adopt: adopt };
};
exports.useEngineRead = useEngineRead;
