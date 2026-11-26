"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccounts = exports.isGone = exports.needsAnswer = exports.pickedOf = exports.NO_ACCOUNT = void 0;
// The answer "No GitHub account". Null is no answer yet. A login is never empty.
exports.NO_ACCOUNT = '';
var accountsIn = function (load) { return (load.status === 'ready' && load.data.kind === 'ready' ? load.data.accounts : []); };
var isKnown = function (load, login) { return accountsIn(load).some(function (account) { return account.login === login; }); };
// What's picked: a real answer, or the only account there is. A login gh no
// longer knows isn't an answer, however it was saved.
var pickedOf = function (load, choice) {
    if (choice === exports.NO_ACCOUNT || (choice !== null && isKnown(load, choice)))
        return choice;
    var accounts = accountsIn(load);
    return accounts.length === 1 ? accounts[0].login : null;
};
exports.pickedOf = pickedOf;
// Only a question there are answers to holds anything up.
var needsAnswer = function (load, picked) { return picked === null && (load.status === 'loading' || accountsIn(load).length > 0); };
exports.needsAnswer = needsAnswer;
var isGone = function (load, connected) { return connected !== null && load.status === 'ready' && load.data.kind === 'ready' && !isKnown(load, connected); };
exports.isGone = isGone;
var hasAccounts = function (load) { return accountsIn(load).length > 0; };
exports.hasAccounts = hasAccounts;
