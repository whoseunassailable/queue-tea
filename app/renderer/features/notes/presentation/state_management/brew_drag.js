"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBrewDrag = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../../../../core/constants/constants");
// Only a drag begun by this realm's robot can start a review. A matching MIME
// type from another window, a file or selected text is not enough.
var useBrewDrag = function (realm) {
    var active = (0, hooks_1.useRef)(false);
    var _a = (0, hooks_1.useState)(false), isDragging = _a[0], setDragging = _a[1];
    var _b = (0, hooks_1.useState)(null), over = _b[0], setOver = _b[1];
    var end = function () {
        active.current = false;
        setDragging(false);
        setOver(null);
    };
    (0, hooks_1.useEffect)(function () {
        window.addEventListener('drop', end);
        window.addEventListener('dragend', end);
        window.addEventListener('blur', end);
        return function () {
            window.removeEventListener('drop', end);
            window.removeEventListener('dragend', end);
            window.removeEventListener('blur', end);
        };
    }, []);
    var accepts = function (event) { var _a, _b; return active.current && Array.from((_b = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) !== null && _b !== void 0 ? _b : []).includes(constants_1.NOTE_BREW_DRAG_TYPE); };
    var source = {
        draggable: true,
        onDragStart: function (event) {
            if (event.dataTransfer === null)
                return;
            // No text/plain payload: a drop on a field must never insert text.
            event.dataTransfer.setData(constants_1.NOTE_BREW_DRAG_TYPE, realm);
            event.dataTransfer.effectAllowed = 'copy';
            active.current = true;
            setDragging(true);
        },
        onDragEnd: end,
    };
    var target = function (id, isLive, onDrop) { return ({
        'data-brew-target': isLive && isDragging ? 'true' : undefined,
        'data-brew-over': isLive && isDragging && over === id ? 'true' : undefined,
        onDragOver: function (event) {
            if (!isLive || !accepts(event))
                return;
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'copy';
            setOver(id);
        },
        onDragLeave: function (event) {
            if (!event.currentTarget.contains(event.relatedTarget))
                setOver(function (was) { return was === id ? null : was; });
        },
        onDrop: function (event) {
            if (!isLive || !accepts(event))
                return;
            event.preventDefault();
            event.stopPropagation();
            var isFromHere = event.dataTransfer.getData(constants_1.NOTE_BREW_DRAG_TYPE) === realm;
            end();
            if (isFromHere)
                onDrop();
        },
    }); };
    return { isDragging: isDragging, source: source, target: target };
};
exports.useBrewDrag = useBrewDrag;
