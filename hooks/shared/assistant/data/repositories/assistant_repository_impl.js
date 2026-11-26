"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantRepositoryImpl = void 0;
var assistantRepositoryImpl = function (p) { return ({
    fork: function (prompt) { return p.ask.fork(prompt); },
    clear: function () { return p.clear(); },
    submit: function (text, asUser) { return p.submit(text, asUser); },
}); };
exports.assistantRepositoryImpl = assistantRepositoryImpl;
