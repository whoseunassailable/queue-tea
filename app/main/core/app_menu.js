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
exports.appMenu = void 0;
// A single letter must not be a real shortcut, or it would never reach a text
// field. The menu shows it and leaves the key to the window.
var letter = function (label, key, send) { return ({ label: label, accelerator: key, registerAccelerator: false, click: function () { return send({ kind: 'key', key: key, isMeta: false }); } }); };
// Pressed in the window the key arrives there first; this is for the mouse.
var command = function (label, key, send) { return ({ label: label, accelerator: "CmdOrCtrl+".concat(key), click: function () { return send({ kind: 'key', key: key.toLowerCase(), isMeta: true }); } }); };
var TABS = [
    ['Home', '1'],
    ['Quests', '2'],
    ['Designs', '3'],
    ['Branches', '4'],
    ['Chronicle', '5'],
    ['Mana & time', '6'],
    ['Notes', '7'],
    ['Calendar', '8'],
];
var appMenu = function (appName, isDev, send) { return [
    {
        label: appName,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: function () { return send({ kind: 'key', key: ',', isMeta: true }); } },
            { label: 'Install command line tool…', click: function () { return send({ kind: 'installCommand' }); } },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    },
    {
        label: 'File',
        submenu: [command('New quest', 'N', send), { label: 'New note', accelerator: 'Shift+CmdOrCtrl+N', click: function () { return send({ kind: 'key', key: 'N', isMeta: true }); } }, command('Open folder…', 'O', send), { type: 'separator' }, { label: 'Show record in Finder', click: function () { return send({ kind: 'showRecord' }); } }],
    },
    {
        label: 'Edit',
        submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }, { type: 'separator' }, command('Find', 'F', send)],
    },
    {
        label: 'Quest',
        submenu: [
            letter('Start', 's', send),
            { label: 'Open in Claude Code', accelerator: 'CmdOrCtrl+Enter', registerAccelerator: false, click: function () { return send({ kind: 'key', key: 'Enter', isMeta: true }); } },
            letter('Finish quest…', 'd', send),
            letter('Back to the board', 'b', send),
            { type: 'separator' },
            letter('Yes, finish it…', 'y', send),
            letter('Not yet', 'n', send),
            { type: 'separator' },
            letter('Seal…', 'k', send),
            letter('Unseal', 'u', send),
            letter('Play next', 'f', send),
            letter('Part of…', 'p', send),
            letter('Active saga', 'a', send),
            letter('Time I have', 't', send),
            letter('Remove…', 'x', send),
            { type: 'separator' },
            letter('Check again', 'r', send),
            letter('Use the last good copy', 'l', send),
            letter('Switch to the quest’s branch', 'w', send),
        ],
    },
    {
        label: 'View',
        submenu: __spreadArray(__spreadArray(__spreadArray([], TABS.map(function (_a) {
            var label = _a[0], key = _a[1];
            return command(label, key, send);
        }), true), [
            { type: 'separator' },
            command('Command palette', 'K', send),
            { label: 'Show realms', accelerator: 'Ctrl+Cmd+S', click: function () { return send({ kind: 'toggleRealms' }); } }
        ], false), (isDev ? [{ type: 'separator' }, { role: 'reload' }, { role: 'toggleDevTools' }] : []), true),
    },
    { role: 'windowMenu' },
    { role: 'help', submenu: [{ label: 'Keys and commands', click: function () { return send({ kind: 'key', key: 'k', isMeta: true }); } }] },
]; };
exports.appMenu = appMenu;
