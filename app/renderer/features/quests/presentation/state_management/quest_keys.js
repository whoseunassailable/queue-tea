"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuestKeys = exports.menuKey = exports.isLetterKey = exports.questKeyOf = exports.isTyping = void 0;
var window_keys_1 = require("../../../../core/widgets/window_keys");
var PRIORITY_KEYS = ['urgent', 'high', 'mid', 'okay', 'low'];
var LETTERS = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'fold',
    ArrowRight: 'unfold',
    f: 'playNext',
    k: 'seal',
    u: 'unseal',
    p: 'partOf',
    a: 'activeSaga',
    x: 'remove',
    Backspace: 'remove',
    s: 'start',
    d: 'finish',
    b: 'back',
    c: 'open',
    y: 'yes',
    n: 'notYet',
    r: 'checkAgain',
    Escape: 'cancel',
    Enter: 'detail',
    t: 'time',
    w: 'switch',
    o: 'dismiss',
};
// A press inside a text field is typing, never a command.
var isTyping = function (target) {
    var _a;
    var element = target;
    return element !== null && (['INPUT', 'TEXTAREA', 'SELECT'].includes((_a = element.tagName) !== null && _a !== void 0 ? _a : '') || element.isContentEditable === true);
};
exports.isTyping = isTyping;
// What a key does on the board, or null when it does nothing there. The
// letters are the terminal's own.
var questKeyOf = function (event) {
    if (event.key === 'Enter' && event.metaKey)
        return { kind: 'open' };
    if (event.metaKey || event.ctrlKey || event.altKey)
        return null;
    var priority = PRIORITY_KEYS[Number(event.key) - 1];
    if (priority !== undefined)
        return { kind: 'priority', priority: priority };
    var kind = LETTERS[event.key];
    return kind === undefined ? null : { kind: kind };
};
exports.questKeyOf = questKeyOf;
// The keys Settings can switch off: a letter, a digit, or Delete for Remove.
var isLetterKey = function (key) { return key.length === 1 || key === 'Backspace'; };
exports.isLetterKey = isLetterKey;
// Return on a focused button or link is that control's own: it presses it.
var isOnControl = function (target) { var _a; return ((_a = target === null || target === void 0 ? void 0 : target.closest) === null || _a === void 0 ? void 0 : _a.call(target, 'button, a, summary')) != null; };
// A key the menu bar sent. Choosing from a menu isn't a single-key shortcut, so
// the Settings switch leaves it alone.
var menuKey = function (key, isMeta) { return Object.assign(new KeyboardEvent('keydown', { key: key, metaKey: isMeta, cancelable: true }), { isFromMenu: true }); };
exports.menuKey = menuKey;
var isFromMenu = function (event) { return event.isFromMenu === true; };
// A page answers false for a key it has no use for, so that key keeps its
// ordinary job, such as an arrow scrolling Home.
var useQuestKeys = function (isOn, letterKeys, onKey) {
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (!isOn || (0, exports.isTyping)(event.target) || (!letterKeys && !isFromMenu(event) && !event.metaKey && (0, exports.isLetterKey)(event.key)))
            return;
        var key = (0, exports.questKeyOf)(event);
        if ((key === null || key === void 0 ? void 0 : key.kind) === 'detail' && isOnControl(event.target))
            return;
        if (key !== null && onKey(key) !== false)
            event.preventDefault();
    });
};
exports.useQuestKeys = useQuestKeys;
