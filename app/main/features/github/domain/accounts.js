"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeOf = exports.gitProtocolOf = exports.accountsOf = exports.isGithubLogin = void 0;
var HOST = 'github.com';
var LOGIN = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/;
var CODE = /one-time code:\s*([A-Z0-9]{4}-[A-Z0-9]{4})/;
var ADDRESS = /https:\/\/github\.com\/login\/device/;
var isGithubLogin = function (value) { return typeof value === 'string' && LOGIN.test(value); };
exports.isGithubLogin = isGithubLogin;
var rawAccounts = function (json) {
    var _a;
    try {
        var parsed = JSON.parse(json);
        var accounts = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.hosts) === null || _a === void 0 ? void 0 : _a[HOST];
        return Array.isArray(accounts) ? accounts : [];
    }
    catch (_b) {
        // Anything but gh's JSON means no accounts can be read from it.
        return [];
    }
};
// `gh auth status --json hosts`. Tokens never come into it: gh keeps them. A
// timeout means GitHub couldn't be reached, which says nothing about the sign-in.
var accountsOf = function (json) {
    return rawAccounts(json).flatMap(function (account) { return ((0, exports.isGithubLogin)(account.login) ? [{ login: account.login, isActive: account.active === true, isWorking: account.state !== 'error' }] : []); });
};
exports.accountsOf = accountsOf;
// The protocol gh is set to, so adding an account doesn't change it.
var gitProtocolOf = function (json) {
    var _a;
    var protocol = (_a = rawAccounts(json).find(function (account) { return account.gitProtocol !== undefined; })) === null || _a === void 0 ? void 0 : _a.gitProtocol;
    return protocol === 'ssh' ? 'ssh' : 'https';
};
exports.gitProtocolOf = gitProtocolOf;
// The one-time code in gh's sign-in output, once it has printed the address too.
// Only GitHub's own address counts, because the app opens it.
var codeOf = function (output) {
    var _a, _b;
    var code = (_a = output.match(CODE)) === null || _a === void 0 ? void 0 : _a[1];
    var url = (_b = output.match(ADDRESS)) === null || _b === void 0 ? void 0 : _b[0];
    return code === undefined || url === undefined ? null : { code: code, url: url };
};
exports.codeOf = codeOf;
