"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENGINE_FILE_LIMIT = void 0;
// The most Claude Code's $.fs.read and $.fs.write take at once, in bytes
// (Claude Code 2.1). A read past it is refused unless it asks for a range of
// bytes; a write past it is refused. The app's own file calls have no limit.
exports.ENGINE_FILE_LIMIT = 4 * 1024 * 1024;
