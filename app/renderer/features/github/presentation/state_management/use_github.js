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
exports.useGithub = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var IDLE = { status: 'idle' };
// The accounts gh knows and adding one. Read once, on opening: asking gh goes
// out to GitHub, so it doesn't run every time a record changes. A sign-in still
// running when this goes away is cancelled, so none outlives its dialog.
var useGithub = function (engine, onAdded) {
    var _a = (0, hooks_1.useState)({ status: 'loading' }), accounts = _a[0], setAccounts = _a[1];
    var _b = (0, hooks_1.useState)(IDLE), signIn = _b[0], setSignIn = _b[1];
    var isAlive = (0, hooks_1.useRef)(true);
    var isRunning = (0, hooks_1.useRef)(false);
    var wasCancelled = (0, hooks_1.useRef)(false);
    var added = (0, hooks_1.useRef)(onAdded);
    added.current = onAdded;
    var stop = (0, hooks_1.useCallback)(function () { return (0, engine_client_1.ask)(engine, function () { return engine.cancelGithubLogin(); }); }, [engine]);
    var read = (0, hooks_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setAccounts({ status: 'loading' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readGithub(); })];
                case 1:
                    answer = _a.sent();
                    if (isAlive.current)
                        setAccounts(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message });
                    return [2 /*return*/];
            }
        });
    }); }, [engine]);
    (0, hooks_1.useEffect)(function () {
        void read();
    }, [read]);
    (0, hooks_1.useEffect)(function () { return function () {
        isAlive.current = false;
        if (isRunning.current)
            void stop();
    }; }, [stop]);
    var add = function () { return __awaiter(void 0, void 0, void 0, function () {
        var started, outcome;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isRunning.current)
                        return [2 /*return*/];
                    isRunning.current = true;
                    wasCancelled.current = false;
                    setSignIn({ status: 'starting' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.startGithubLogin(); })];
                case 1:
                    started = _b.sent();
                    if (!isAlive.current || wasCancelled.current) {
                        // It finished starting after everyone stopped waiting for it.
                        if (started.ok)
                            void stop();
                        isRunning.current = false;
                        return [2 /*return*/];
                    }
                    if (!started.ok) {
                        isRunning.current = false;
                        setSignIn({ status: 'failed', message: started.message });
                        return [2 /*return*/];
                    }
                    setSignIn({ status: 'code', code: started.data.code, note: null });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.awaitGithubLogin(); })];
                case 2:
                    outcome = _b.sent();
                    isRunning.current = false;
                    if (!isAlive.current || wasCancelled.current)
                        return [2 /*return*/];
                    if (!outcome.ok) {
                        setSignIn({ status: 'failed', message: outcome.message });
                        return [2 /*return*/];
                    }
                    setAccounts({ status: 'ready', data: outcome.data.view });
                    setSignIn(outcome.data.added === null ? { status: 'same' } : IDLE);
                    if (outcome.data.added !== null)
                        (_a = added.current) === null || _a === void 0 ? void 0 : _a.call(added, outcome.data.added);
                    return [2 /*return*/];
            }
        });
    }); };
    var openGithub = function (code) { return __awaiter(void 0, void 0, void 0, function () {
        var opened;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.copyText(code); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.openGithubLogin(); })];
                case 2:
                    opened = _a.sent();
                    if (!opened.ok && isAlive.current)
                        setSignIn({ status: 'code', code: code, note: opened.message });
                    return [2 /*return*/];
            }
        });
    }); };
    var cancel = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wasCancelled.current = true;
                    setSignIn(IDLE);
                    return [4 /*yield*/, stop()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return { accounts: accounts, signIn: signIn, isSigningIn: signIn.status === 'starting' || signIn.status === 'code', read: function () { return void read(); }, add: function () { return void add(); }, openGithub: function (code) { return void openGithub(code); }, cancel: function () { return void cancel(); } };
};
exports.useGithub = useGithub;
