"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELPERS = void 0;
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var en_1 = require("../../../l10n/en");
// Bundled at build time from the helpers themselves, so the page can't drift
// from what they really are.
var FILES = import.meta.glob('../../../../../agents/*.md', { query: '?raw', import: 'default', eager: true });
var LOGOS = import.meta.glob('../../../../../.claude-plugin/helpers/*.svg', { query: '?url', import: 'default', eager: true });
var KINDS = { 'commit-chai-n': 'git', 'mocha-mockup': 'design', 'chai-pter': 'docs', 'tea-dd': 'tests' };
var fileNamed = function (files, name) { var _a, _b; return (_b = (_a = Object.entries(files).find(function (_a) {
    var path = _a[0];
    return path.endsWith("/".concat(name));
})) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''; };
// "name: value" lines and a "skills:" list, which is all the frontmatter holds.
var frontmatter = function (text) {
    var _a, _b, _c;
    var head = (_a = text.split('---')[1]) !== null && _a !== void 0 ? _a : '';
    var description = (_c = (_b = head.match(/^description:\s*(.*)$/m)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : '';
    var skills = __spreadArray([], head.matchAll(/^\s+-\s+(?:[\w-]+:)?([\w-]+)\s*$/gm), true).map(function (match) { return match[1]; });
    return { description: description, skills: skills };
};
var helperOf = function (id) {
    var _a;
    var _b = frontmatter(fileNamed(FILES, "".concat(id, ".md"))), description = _b.description, skills = _b.skills;
    var end = description.indexOf('. ');
    var lead = end === -1 ? description : description.slice(0, end);
    return {
        id: id,
        name: (_a = lead.split(',')[0]) !== null && _a !== void 0 ? _a : id,
        role: en_1.t.guild.roles[id],
        kind: KINDS[id],
        // The first sentence only says who it is, and the card already does.
        summary: end === -1 ? description : description.slice(end + 2),
        skills: skills,
        mention: "@queue-tea:".concat(id),
        logo: fileNamed(LOGOS, "".concat(id, ".svg")),
    };
};
exports.HELPERS = helpers_1.HELPER_IDS.map(helperOf);
