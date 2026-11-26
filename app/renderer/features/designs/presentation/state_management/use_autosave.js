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
exports.useAutosave = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var constants_1 = require("../../../../core/constants/constants");
// Saves a design a moment after the last change, one save at a time. When
// the file changed on disk since it was read, nothing more is written until
// the editor says what to do.
var useAutosave = function (engine, realm, folder, id, firstStamp) {
    var _a = (0, hooks_1.useState)({ kind: 'idle' }), state = _a[0], setState = _a[1];
    var stamp = (0, hooks_1.useRef)(firstStamp);
    var pending = (0, hooks_1.useRef)(null);
    var isBusy = (0, hooks_1.useRef)(false);
    var isHeld = (0, hooks_1.useRef)(false);
    var timer = (0, hooks_1.useRef)(undefined);
    var flush = (0, hooks_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var scene, answer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clearTimeout(timer.current);
                    if (isBusy.current || isHeld.current || pending.current === null)
                        return [2 /*return*/];
                    scene = pending.current;
                    pending.current = null;
                    isBusy.current = true;
                    setState({ kind: 'saving' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.saveDesign(realm, folder, id, scene, stamp.current); })];
                case 1:
                    answer = _b.sent();
                    isBusy.current = false;
                    if (!answer.ok || answer.data.kind === 'changed') {
                        // What didn't save waits, unless something newer is already waiting.
                        (_a = pending.current) !== null && _a !== void 0 ? _a : (pending.current = scene);
                        if (answer.ok)
                            isHeld.current = true;
                        setState(answer.ok ? { kind: 'changed' } : { kind: 'failed', message: answer.message });
                        return [2 /*return*/];
                    }
                    stamp.current = answer.data.stamp;
                    setState({ kind: 'saved', at: answer.data.at });
                    if (pending.current !== null)
                        void flush();
                    return [2 /*return*/];
            }
        });
    }); }, [engine, realm, folder, id]);
    var schedule = (0, hooks_1.useCallback)(function (scene) {
        pending.current = scene;
        clearTimeout(timer.current);
        timer.current = setTimeout(function () { return void flush(); }, constants_1.AUTOSAVE_MS);
    }, [flush]);
    // A fresh read of the file: what's waiting is dropped, and saving resumes.
    var reset = (0, hooks_1.useCallback)(function (nextStamp) {
        clearTimeout(timer.current);
        pending.current = null;
        isHeld.current = false;
        stamp.current = nextStamp;
        setState({ kind: 'idle' });
    }, []);
    // Leaving the design, or closing the window, saves what's waiting.
    (0, hooks_1.useEffect)(function () {
        var closing = function () { return void flush(); };
        window.addEventListener('beforeunload', closing);
        return function () {
            window.removeEventListener('beforeunload', closing);
            void flush();
        };
    }, [flush]);
    return { state: state, schedule: schedule, flush: flush, reset: reset, hasPending: function () { return pending.current !== null; } };
};
exports.useAutosave = useAutosave;
