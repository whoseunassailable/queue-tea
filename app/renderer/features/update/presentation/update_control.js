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
exports.UpdateControl = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../core/api/engine_client");
var use_engine_read_1 = require("../../../core/api/use_engine_read");
var states_1 = require("../../../core/widgets/states");
var en_1 = require("../../../l10n/en");
var constants_1 = require("../../../core/constants/constants");
var routes_1 = require("../../../config/routing/routes");
var UpdateControl = function (_a) {
    var _b, _c, _d, _e;
    var engine = _a.engine, _f = _a.isSettings, isSettings = _f === void 0 ? false : _f;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readAppUpdate(); }, [engine]);
    var _g = (0, hooks_1.useState)(false), sending = _g[0], setSending = _g[1];
    // A failed press holds the update it was pressed on, and stops showing once a read moves past it.
    var _h = (0, hooks_1.useState)(null), failure = _h[0], setFailure = _h[1];
    var pending = (0, hooks_1.useRef)(false);
    (0, hooks_1.useEffect)(function () {
        var timer = setInterval(read.refresh, constants_1.UPDATE_POLL_MS);
        return function () { return clearInterval(timer); };
    }, [read.refresh]);
    var data = read.load.status === 'ready' ? read.load.data : null;
    var phase = (_b = data === null || data === void 0 ? void 0 : data.state.phase) !== null && _b !== void 0 ? _b : 'idle';
    var readFailed = read.note !== null;
    var at = "".concat(phase, " ").concat(data === null || data === void 0 ? void 0 : data.state.commit);
    var busy = sending || read.load.status === 'loading' || ['queued', 'checking', 'building', 'verifying', 'installing'].includes(phase);
    var apply = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pending.current)
                        return [2 /*return*/];
                    if (readFailed) {
                        read.retry();
                        return [2 /*return*/];
                    }
                    pending.current = true;
                    setSending(true);
                    setFailure(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.applyAppUpdate(); })];
                case 1:
                    result = _a.sent();
                    pending.current = false;
                    setSending(false);
                    if (result.ok)
                        read.adopt(result.data);
                    else
                        setFailure({ message: result.message, at: at });
                    return [2 /*return*/];
            }
        });
    }); };
    var failed = (failure === null || failure === void 0 ? void 0 : failure.at) === at ? failure.message : null;
    var line = (_d = (_c = failed !== null && failed !== void 0 ? failed : read.note) !== null && _c !== void 0 ? _c : data === null || data === void 0 ? void 0 : data.state.detail) !== null && _d !== void 0 ? _d : (read.load.status === 'loading' ? en_1.t.update.reading : (data === null || data === void 0 ? void 0 : data.canRestart) ? en_1.t.update.ready : en_1.t.update.phases[phase]);
    return <div class="app-update" aria-label={en_1.t.update.label}>
    <a class={isSettings ? 'side-link on' : 'side-link'} href={(0, routes_1.hrefOf)(routes_1.ROUTES.settings)} aria-label={en_1.t.nav.settings} aria-current={isSettings ? 'page' : undefined}>
      {en_1.t.nav.settings} <span class="app-version" title={(_e = data === null || data === void 0 ? void 0 : data.running.commit) !== null && _e !== void 0 ? _e : undefined}>{data ? en_1.t.update.version(data.running.version) : en_1.t.update.reading}</span>
    </a>
    <button type="button" class="update-button" disabled={sending || (!(data === null || data === void 0 ? void 0 : data.canRestart) && (busy || (!(data === null || data === void 0 ? void 0 : data.canRetry) && !readFailed)))} onClick={function () { return void apply(); }}>
      {(data === null || data === void 0 ? void 0 : data.canRetry) || readFailed ? en_1.t.update.retry : en_1.t.update.button}
    </button>
    <p role={failed || phase === 'failed' || read.note ? 'alert' : 'status'}>{busy && <states_1.Spinner />}{line}</p>
  </div>;
};
exports.UpdateControl = UpdateControl;
