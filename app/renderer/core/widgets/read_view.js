"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadView = void 0;
var states_1 = require("./states");
// Every page's three states, so none of them can leave one out.
var ReadView = function (_a) {
    var read = _a.read, line = _a.line, children = _a.children;
    var load = read.load, note = read.note, retry = read.retry;
    if (load.status === 'loading')
        return <states_1.Loading line={line}/>;
    if (load.status === 'failed')
        return <states_1.Failed message={load.message} onRetry={retry}/>;
    return (<>
      {note !== null && (<p class="note panel" role="status">
          {note}
        </p>)}
      {children(load.data)}
    </>);
};
exports.ReadView = ReadView;
