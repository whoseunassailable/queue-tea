"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityControl = void 0;
var hooks_1 = require("preact/hooks");
var en_1 = require("../../../../l10n/en");
var PRIORITIES = ['urgent', 'high', 'mid', 'okay', 'low'];
var PriorityControl = function (_a) {
    var title = _a.title, priority = _a.priority, isSaved = _a.isSaved, onPick = _a.onPick;
    var _b = (0, hooks_1.useState)(false), isOpen = _b[0], setOpen = _b[1];
    var box = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(function () {
        if (!isOpen)
            return undefined;
        var away = function (event) {
            var _a;
            if (!((_a = box.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)))
                setOpen(false);
        };
        var heard = function (event) {
            if (event.key === 'Escape')
                setOpen(false);
        };
        window.addEventListener('mousedown', away);
        window.addEventListener('keydown', heard);
        return function () {
            window.removeEventListener('mousedown', away);
            window.removeEventListener('keydown', heard);
        };
    }, [isOpen]);
    return (<span class="prio" ref={box}>
      <button type="button" class={"tag ".concat(priority, " prio-btn")} aria-haspopup="menu" aria-expanded={isOpen ? 'true' : 'false'} aria-label={en_1.t.edit.priorityOf(title, en_1.t.priority[priority])} onClick={function () { return setOpen(!isOpen); }}>
        {en_1.t.priority[priority]} <span aria-hidden="true">{isSaved ? '✓' : '▾'}</span>
      </button>
      {isOpen && (<span class="prio-menu" role="menu">
          {PRIORITIES.map(function (choice, i) { return (<button key={choice} type="button" role="menuitemradio" aria-checked={choice === priority ? 'true' : 'false'} class="prio-item" onClick={function () {
                    setOpen(false);
                    if (choice !== priority)
                        onPick(choice);
                }}>
              <kbd>{i + 1}</kbd>
              {en_1.t.priority[choice]}
              {choice === priority && ' ✓'}
            </button>); })}
        </span>)}
    </span>);
};
exports.PriorityControl = PriorityControl;
