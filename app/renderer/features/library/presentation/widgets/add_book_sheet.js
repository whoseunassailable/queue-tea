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
exports.AddBookSheet = void 0;
var hooks_1 = require("preact/hooks");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var en_1 = require("../../../../l10n/en");
var book_form_1 = require("../../domain/book_form");
var AddBookSheet = function (_a) {
    var onAdd = _a.onAdd, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(book_form_1.EMPTY_BOOK), form = _b[0], setForm = _b[1];
    var _c = (0, hooks_1.useState)({}), touched = _c[0], setTouched = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    var isSending = (0, hooks_1.useRef)(false);
    var errors = (0, book_form_1.validateBook)(form);
    var errorOf = function (field) { return (touched[field] === true ? errors[field] : undefined); };
    var touch = function (field) { return function () { return setTouched(function (was) {
        var _a;
        return (__assign(__assign({}, was), (_a = {}, _a[field] = true, _a)));
    }); }; };
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched({ title: true, totalPages: true, page: true });
                    setFailure(null);
                    if (isSending.current || Object.keys(errors).length > 0)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, onAdd((0, book_form_1.bookOf)(form))];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.library.sheet} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <field_1.Field label={en_1.t.form.title} isRequired value={form.title} error={errorOf('title')} onInput={function (title) { return setForm(function (was) { return (__assign(__assign({}, was), { title: title })); }); }} onBlur={touch('title')} onEnter={function () { return void submit(); }}/>
      <field_1.Field label={en_1.t.library.author} value={form.author} onInput={function (author) { return setForm(function (was) { return (__assign(__assign({}, was), { author: author })); }); }} onEnter={function () { return void submit(); }}/>
      <field_1.Field label={en_1.t.library.totalPages} isRequired value={form.totalPages} error={errorOf('totalPages')} onInput={function (totalPages) { return setForm(function (was) { return (__assign(__assign({}, was), { totalPages: totalPages })); }); }} onBlur={touch('totalPages')} onEnter={function () { return void submit(); }}/>
      <field_1.Field label={en_1.t.library.startPage} value={form.page} error={errorOf('page')} onInput={function (page) { return setForm(function (was) { return (__assign(__assign({}, was), { page: page })); }); }} onBlur={touch('page')} onEnter={function () { return void submit(); }}/>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.library.addIt}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.AddBookSheet = AddBookSheet;
