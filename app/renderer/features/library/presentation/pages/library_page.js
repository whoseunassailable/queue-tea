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
exports.LibraryPage = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var dialog_1 = require("../../../../core/widgets/dialog");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var add_book_sheet_1 = require("../widgets/add_book_sheet");
var book_card_1 = require("../widgets/book_card");
var RemoveBook = function (_a) {
    var book = _a.book, onRemove = _a.onRemove, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(null), failure = _b[0], setFailure = _b[1];
    var isSending = (0, hooks_1.useRef)(false);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, onRemove(book)];
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
    return (<dialog_1.Dialog title={en_1.t.library.removeTitle(book.title)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      <p class="form-line">{en_1.t.library.removeLine}</p>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.library.removeIt}
        </button>
      </div>
    </dialog_1.Dialog>);
};
var FinishedBook = function (_a) {
    var _b;
    var book = _a.book, onRemove = _a.onRemove;
    return (<div class="set-row">
    <span>
      <span class="book-done">{book.title}</span>
      {book.author !== null && <span class="sub"> · {book.author}</span>}
    </span>
    <span class="val">{en_1.t.library.finishedOn(en_1.t.library.day((_b = book.finished) !== null && _b !== void 0 ? _b : book.started), book.totalPages)}</span>
    <button type="button" class="chip-btn" aria-label={en_1.t.library.remove(book.title)} onClick={function () { return onRemove(book); }}>
      {en_1.t.library.removeShort}
    </button>
  </div>);
};
var Shelf = function (_a) {
    var view = _a.view, actions = _a.actions;
    if (view.reading.length === 0 && view.finished.length === 0)
        return <states_1.Empty title={en_1.t.library.emptyTitle} line={en_1.t.library.empty}/>;
    return (<>
      <section class="panel panel-pad" aria-labelledby="lib-reading">
        <div class="sec-row">
          <h2 id="lib-reading">{en_1.t.library.reading}</h2>
        </div>
        {view.reading.length === 0 && <p class="hint">{en_1.t.library.noneReading}</p>}
        <div class="shelf">
          {view.reading.map(function (book) { return (<book_card_1.BookCard key={book.id} book={book} actions={actions}/>); })}
        </div>
      </section>
      <section class="panel panel-pad" aria-labelledby="lib-finished">
        <div class="sec-row">
          <h2 id="lib-finished">{en_1.t.library.finished}</h2>
        </div>
        {view.finished.length === 0 && <p class="hint">{en_1.t.library.noneFinished}</p>}
        {view.finished.map(function (book) { return (<FinishedBook key={book.id} book={book} onRemove={actions.onRemove}/>); })}
      </section>
    </>);
};
// Your reading, which belongs to no realm, so this page doesn't wait for one.
var LibraryPage = function (_a) {
    var engine = _a.engine;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readLibrary(); }, []);
    var _b = (0, hooks_1.useState)(false), isAdding = _b[0], setAdding = _b[1];
    var _c = (0, hooks_1.useState)(null), removing = _c[0], setRemoving = _c[1];
    var change = function (call) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        read.adopt(answer.data);
                    return [2 /*return*/, answer];
            }
        });
    }); };
    var actions = {
        onPage: function (book, page) { return change(function () { return engine.setBookPage(book.id, page); }); },
        onFinish: function (book) { return change(function () { return engine.finishBook(book.id); }); },
        onRemove: setRemoving,
    };
    return (<main class="page lib">
      <read_view_1.ReadView read={read} line={en_1.t.loading.library}>
        {function (view) { return (<>
            <div class="page-h panel">
              <h1>{en_1.t.library.title}</h1>
              {view.reading.length + view.finished.length > 0 && (<p class="lib-stats">
                  <b>{en_1.t.library.stats(view.finishedCount, view.pagesRead)}</b>
                  <span class="sub">{en_1.t.library.pace(view.pagesToday, view.pagesThisWeek)}</span>
                </p>)}
              <button type="button" class="btn primary" onClick={function () { return setAdding(true); }}>
                {en_1.t.library.add}
              </button>
            </div>
            <Shelf view={view} actions={actions}/>
          </>); }}
      </read_view_1.ReadView>
      {isAdding && <add_book_sheet_1.AddBookSheet onAdd={function (book) { return change(function () { return engine.addBook(book); }); }} onClose={function () { return setAdding(false); }}/>}
      {removing !== null && <RemoveBook book={removing} onRemove={function (book) { return change(function () { return engine.removeBook(book.id); }); }} onClose={function () { return setRemoving(null); }}/>}
    </main>);
};
exports.LibraryPage = LibraryPage;
