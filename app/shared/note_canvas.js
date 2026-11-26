"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANVAS_SIDES = exports.CANVAS_LIMITS = exports.NOTE_CANVAS = void 0;
// A realm's canvas: one board of cards and lines, kept as Obsidian's open
// JSON Canvas format (jsoncanvas.org) beside the notes, so it opens there too.
// docs/notes.md has the cards Queue-tea makes.
exports.NOTE_CANVAS = 'Canvas.canvas';
exports.CANVAS_LIMITS = { nodes: 1000, edges: 3000, text: 100000, id: 64, extras: 20, coordinate: 10000000, bytes: 5000000 };
exports.CANVAS_SIDES = ['top', 'right', 'bottom', 'left'];
