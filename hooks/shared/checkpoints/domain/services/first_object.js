"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstObject = void 0;
// The first balanced JSON object in a reply, strings respected.
var firstObject = function (reply) {
    var start = reply.indexOf('{');
    if (start < 0)
        return null;
    var depth = 0;
    var inString = false;
    for (var i = start; i < reply.length; i += 1) {
        var c = reply[i];
        if (inString) {
            if (c === '\\')
                i += 1;
            else if (c === '"')
                inString = false;
        }
        else if (c === '"')
            inString = true;
        else if (c === '{')
            depth += 1;
        else if (c === '}') {
            depth -= 1;
            if (depth === 0)
                return reply.slice(start, i + 1);
        }
    }
    return null;
};
exports.firstObject = firstObject;
