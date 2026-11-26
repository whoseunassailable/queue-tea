"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingRead = void 0;
// Share simultaneous UI reads, never a completed snapshot. Mutating operations
// use their own direct freshness checks and do not pass through this map.
var pending = new WeakMap();
var pendingRead = function (owner, parts, read) {
    // Invalid IPC input still reaches normal API validation, without serializing
    // arbitrary objects or allowing them to collide with a valid request.
    if (parts.some(function (part) { return part !== null && part !== undefined && typeof part !== 'string'; }))
        return read();
    var key = JSON.stringify(parts);
    var reads = pending.get(owner);
    if (!reads) {
        reads = new Map();
        pending.set(owner, reads);
    }
    var existing = reads.get(key);
    if (existing)
        return existing;
    var result = read().finally(function () { return reads.delete(key); });
    reads.set(key, result);
    return result;
};
exports.pendingRead = pendingRead;
