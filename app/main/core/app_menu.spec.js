"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var app_menu_1 = require("./app_menu");
var menu = function (isDev, send) {
    if (isDev === void 0) { isDev = false; }
    if (send === void 0) { send = function () { }; }
    return (0, app_menu_1.appMenu)('Queue-tea', isDev, send);
};
var items = function (label, template) {
    var _a, _b;
    if (template === void 0) { template = menu(); }
    return ((_b = (_a = template.find(function (top) { return top.label === label; })) === null || _a === void 0 ? void 0 : _a.submenu) !== null && _b !== void 0 ? _b : []);
};
var named = function (top, label, template) {
    if (template === void 0) { template = menu(); }
    return items(top, template).find(function (item) { return item.label === label; });
};
var click = function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.click) === null || _a === void 0 ? void 0 : _a.call(item); };
(0, vitest_1.describe)('the menu bar', function () {
    (0, vitest_1.it)('has the menus the design lists', function () {
        (0, vitest_1.expect)(menu().map(function (top) { var _a; return (_a = top.label) !== null && _a !== void 0 ? _a : top.role; })).toEqual(['Queue-tea', 'File', 'Edit', 'Quest', 'View', 'windowMenu', 'help']);
    });
    (0, vitest_1.it)('gives every Quest action a key', function () {
        for (var _i = 0, _a = items('Quest').filter(function (entry) { return entry.type !== 'separator'; }); _i < _a.length; _i++) {
            var item = _a[_i];
            (0, vitest_1.expect)(item.accelerator, item.label).toBeTruthy();
        }
    });
    (0, vitest_1.it)('never registers a single letter, or it could not be typed', function () {
        var letters = items('Quest').filter(function (entry) { return typeof entry.accelerator === 'string' && entry.accelerator.length === 1; });
        (0, vitest_1.expect)(letters.length).toBeGreaterThan(10);
        for (var _i = 0, letters_1 = letters; _i < letters_1.length; _i++) {
            var item = letters_1[_i];
            (0, vitest_1.expect)(item.registerAccelerator, item.label).toBe(false);
        }
    });
    (0, vitest_1.it)('has no item that runs git', function () {
        var labels = menu().flatMap(function (top) { var _a, _b; return (_b = (_a = top.submenu) === null || _a === void 0 ? void 0 : _a.map(function (item) { var _a; return (_a = item.label) !== null && _a !== void 0 ? _a : ''; })) !== null && _b !== void 0 ? _b : []; });
        for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
            var label = labels_1[_i];
            (0, vitest_1.expect)(label).not.toMatch(/\b(commit|push|merge|pull)\b/i);
        }
    });
    (0, vitest_1.it)('sends a letter to the window as a key', function () {
        var send = vitest_1.vi.fn();
        click(named('Quest', 'Start', menu(false, send)));
        (0, vitest_1.expect)(send).toHaveBeenCalledWith({ kind: 'key', key: 's', isMeta: false });
    });
    (0, vitest_1.it)('sends a ⌘ command as the same key', function () {
        var send = vitest_1.vi.fn();
        click(named('File', 'New quest', menu(false, send)));
        (0, vitest_1.expect)(send).toHaveBeenCalledWith({ kind: 'key', key: 'n', isMeta: true });
    });
    (0, vitest_1.it)('sends New note as ⇧⌘N, the capital N the window hears with ⇧ held', function () {
        var send = vitest_1.vi.fn();
        click(named('File', 'New note', menu(false, send)));
        (0, vitest_1.expect)(send).toHaveBeenCalledWith({ kind: 'key', key: 'N', isMeta: true });
    });
    (0, vitest_1.it)('asks the window to show the record, since only it knows which realm', function () {
        var send = vitest_1.vi.fn();
        click(named('File', 'Show record in Finder', menu(false, send)));
        (0, vitest_1.expect)(send).toHaveBeenCalledWith({ kind: 'showRecord' });
    });
    (0, vitest_1.it)('numbers the tabs ⌘1 to ⌘6, with Designs third', function () {
        var tabs = items('View').filter(function (item) { return /^CmdOrCtrl\+\d$/.test(String(item.accelerator)); });
        (0, vitest_1.expect)(tabs.map(function (item) { return [item.label, item.accelerator]; })).toEqual([
            ['Home', 'CmdOrCtrl+1'],
            ['Quests', 'CmdOrCtrl+2'],
            ['Designs', 'CmdOrCtrl+3'],
            ['Branches', 'CmdOrCtrl+4'],
            ['Chronicle', 'CmdOrCtrl+5'],
            ['Mana & time', 'CmdOrCtrl+6'],
            ['Notes', 'CmdOrCtrl+7'],
            ['Calendar', 'CmdOrCtrl+8'],
        ]);
    });
    (0, vitest_1.it)('leaves Reload and the developer tools out of a real build', function () {
        (0, vitest_1.expect)(items('View', menu(false)).some(function (item) { return item.role === 'toggleDevTools'; })).toBe(false);
        (0, vitest_1.expect)(items('View', menu(true)).some(function (item) { return item.role === 'toggleDevTools'; })).toBe(true);
    });
});
