"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKMARK_AGENT = exports.BUSY_PROBE = exports.RESTART_FILE = exports.UPDATE_CHECK_MS = exports.GH_LOGIN_WAIT_MS = exports.GH_CODE_WAIT_MS = exports.GH_PATHS = exports.COPY_LIMIT = exports.RUN_OUTPUT_LIMIT = exports.FORBIDDEN_GIT = exports.WINDOW = exports.WATCH_SETTLE_MS = exports.LOG_FILE = exports.SETTINGS_FILE = exports.projectsFolder = void 0;
// Under the home folder, with forward slashes as the engine writes them.
var projectsFolder = function (home) { return "".concat(home, "/.queue-tea/projects"); };
exports.projectsFolder = projectsFolder;
exports.SETTINGS_FILE = 'settings.json';
exports.LOG_FILE = 'queue-tea.log';
// Events arrive in bursts around an atomic replace; this gathers one burst.
exports.WATCH_SETTLE_MS = 120;
exports.WINDOW = { width: 1280, height: 800, minWidth: 720, minHeight: 560 };
// The general agent Host refuses these. The branch workflow has a separate
// typed capability for actions explicitly approved by the user.
exports.FORBIDDEN_GIT = ['commit', 'push', 'merge', 'pull'];
// The most a command may print. A branch's diff carries graphify's graph files,
// rewritten whole on each build: about 21 MB on 2026-11-18, past the old 16 MB.
exports.RUN_OUTPUT_LIMIT = 256 * 1024 * 1024;
// Longer than any command or path the window has reason to copy.
exports.COPY_LIMIT = 4096;
// Where gh may be. An app opened from the Finder has no shell PATH to find it on.
exports.GH_PATHS = ['/opt/homebrew/bin/gh', '/usr/local/bin/gh', '/usr/bin/gh'];
exports.GH_CODE_WAIT_MS = 20000;
// As long as GitHub's own one-time code lasts.
exports.GH_LOGIN_WAIT_MS = 15 * 60000;
// How often the app looks for a newer copy of itself on disk.
exports.UPDATE_CHECK_MS = 30000;
// Left in the settings folder by an update restart, for the new copy to read once.
exports.RESTART_FILE = 'restart.json';
// Run in the window: true while a restart would lose something, which is a
// dialog open or a text field holding the keyboard.
exports.BUSY_PROBE = "document.querySelector('[role=dialog]') !== null || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName ?? '') || document.activeElement?.isContentEditable === true";
// Sent with a link preview's request; some sites refuse a request without one.
exports.BOOKMARK_AGENT = 'Mozilla/5.0 (compatible; Queue-tea link preview)';
