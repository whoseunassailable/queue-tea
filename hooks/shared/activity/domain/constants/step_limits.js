"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAITING_LIMIT = exports.STEP_SUBJECT_LIMIT = void 0;
// A step is one line: its subject is the first line of the command or the
// file's path, at most this many characters.
exports.STEP_SUBJECT_LIMIT = 200;
// Background shells a task waits on at once. Past this the oldest is
// forgotten: its check's time is then not counted, and nothing else changes.
exports.WAITING_LIMIT = 10;
