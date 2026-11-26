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
exports.HelperToggles = void 0;
var hooks_1 = require("preact/hooks");
var helpers_1 = require("../../../../../../hooks/shared/records/domain/services/helpers");
var en_1 = require("../../../../l10n/en");
var helpers_2 = require("../../../guild/domain/helpers");
// What the quest has on shows at once; a failed save shows the saved list again.
var HelperToggles = function (_a) {
    var on = _a.on, onChange = _a.onChange;
    var _b = (0, hooks_1.useState)(null), pending = _b[0], setPending = _b[1];
    var shown = pending !== null && pending !== void 0 ? pending : on;
    var toggle = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    next = helpers_1.HELPER_IDS.filter(function (other) { return (other === id ? !shown.includes(id) : shown.includes(other)); });
                    setPending(next);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onChange(next)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setPending(function (current) { return (current === next ? null : current); });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div class="helper-chips" role="group" aria-label={en_1.t.helpers.label}>
      {helpers_2.HELPERS.map(function (helper) { return (<button key={helper.id} type="button" class={"helper-chip ".concat(helper.kind)} aria-pressed={shown.includes(helper.id)} aria-label={en_1.t.helpers.use(helper.name)} onClick={function () { return void toggle(helper.id); }}>
          <img src={helper.logo} alt=""/>
          {helper.name}
        </button>); })}
    </div>);
};
exports.HelperToggles = HelperToggles;
