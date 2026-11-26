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
exports.BookCard = void 0;
var hooks_1 = require("preact/hooks");
var en_1 = require("../../../../l10n/en");
var book_form_1 = require("../../domain/book_form");
// A book on the go: how far through it you are, and the page you've reached,
// saved as the field is left.
var BookCard = function (_a) {
    var book = _a.book, actions = _a.actions;
    // What's being typed. Null shows the saved page, so a page saved elsewhere
    // shows here too.
    var _b = (0, hooks_1.useState)(null), draft = _b[0], setDraft = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    var errorId = "".concat((0, hooks_1.useId)(), "-error");
    var page = draft !== null && draft !== void 0 ? draft : String(book.page);
    var percent = Math.round((book.page / book.totalPages) * 100);
    var save = function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    problem = (0, book_form_1.pageError)(page, book.totalPages);
                    setError(problem);
                    if (problem !== undefined)
                        return [2 /*return*/];
                    if (!(Number(page.trim()) !== book.page)) return [3 /*break*/, 2];
                    return [4 /*yield*/, actions.onPage(book, Number(page.trim()))];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok) {
                        setError(answer.message);
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    setDraft(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var finish = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError(undefined);
                    return [4 /*yield*/, actions.onFinish(book)];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok)
                        setError(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<article class="book panel panel-pad">
      <div class="book-head">
        <h3 class="book-title">{book.title}</h3>
        {book.author !== null && <p class="book-author">{book.author}</p>}
      </div>
      <span class="book-bar" role="img" aria-label={en_1.t.library.percent(percent)}>
        <span class="fill" style={{ transform: "scaleX(".concat(book.page / book.totalPages, ")") }}/>
      </span>
      <p class="hud-sub">{en_1.t.library.progress(percent, book.totalPages - book.page)}</p>
      <div class="book-page">
        <span aria-hidden="true">{en_1.t.library.page}</span>
        <input class="input" type="text" inputMode="numeric" aria-label={en_1.t.library.pageOf(book.title)} aria-invalid={error === undefined ? undefined : 'true'} aria-describedby={error === undefined ? undefined : errorId} value={page} onInput={function (event) { return setDraft(event.target.value); }} onBlur={function () { return void save(); }} onKeyDown={function (event) {
            if (event.key === 'Enter')
                event.target.blur();
        }}/>
        <span>{en_1.t.library.ofTotal(book.totalPages)}</span>
      </div>
      {error !== undefined && (<p class="field-error" id={errorId}>
          {error}
        </p>)}
      <div class="book-actions">
        <button type="button" class="chip-btn" aria-label={en_1.t.library.finish(book.title)} onClick={function () { return void finish(); }}>
          {en_1.t.library.finishShort}
        </button>
        <button type="button" class="chip-btn" aria-label={en_1.t.library.remove(book.title)} onClick={function () { return actions.onRemove(book); }}>
          {en_1.t.library.removeShort}
        </button>
      </div>
    </article>);
};
exports.BookCard = BookCard;
