"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
var update_control_1 = require("../../../update/presentation/update_control");
var routes_1 = require("../../../../config/routing/routes");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var statusLine = function (status) {
    if (status.kind === 'judgement')
        return en_1.t.status.judgement;
    if (status.kind === 'needsYou')
        return en_1.t.status.needsYou;
    if (status.kind === 'working')
        return en_1.t.status.working;
    if (status.kind === 'current')
        return en_1.t.status.current(status.title);
    return status.kind === 'nothing' ? en_1.t.status.nothing : en_1.t.status.waiting(status.count, status.title);
};
var markOf = function (session) {
    if (session === 'none')
        return 'mark';
    return session === 'working' || session === 'needsYou' ? 'mark working' : 'mark idle';
};
var Row = function (_a) {
    var row = _a.row, isSelected = _a.isSelected, isDetected = _a.isDetected, onPick = _a.onPick;
    return (<button type="button" class={isSelected ? 'realm sel' : 'realm'} aria-current={isSelected ? 'true' : undefined} onClick={function () { return onPick(row.key); }}>
    {row.kind === 'unreadable' ? (<>
        <span class="realm-l1">
          <span class="mark" aria-hidden="true">
            ⚠
          </span>
          <span class="realm-name">{row.name}</span>
        </span>
        <span class="realm-l2">{en_1.t.unreadable.sidebar}</span>
      </>) : (<>
        <span class="realm-l1">
          <span class={markOf(row.session)} aria-hidden="true"/>
          <span class="realm-name">{row.name}</span>
          {row.waiting > 0 && <span class="count">{row.waiting}</span>}
        </span>
        <span class="realm-l2">
          {isDetected && "".concat(en_1.t.status.detected, " \u00B7 ")}
          {row.status.kind === 'judgement' || row.status.kind === 'needsYou' ? <b>{statusLine(row.status)}</b> : statusLine(row.status)}
        </span>
      </>)}
  </button>);
};
var LINKS = [
    { route: routes_1.ROUTES.guild, label: en_1.t.nav.guild },
    { route: routes_1.ROUTES.hoard, label: en_1.t.nav.hoard },
    { route: routes_1.ROUTES.library, label: en_1.t.nav.library },
];
var Sidebar = function (_a) {
    var engine = _a.engine, projects = _a.projects, selected = _a.selected, detected = _a.detected, route = _a.route, onPick = _a.onPick, onOpenFolder = _a.onOpenFolder;
    return (<nav class="side panel" aria-label={en_1.t.nav.realms}>
    <div class="lights" aria-hidden="true"/>
    <div class="side-h">
      <span>{en_1.t.nav.realms}</span>
      <button type="button" class="icon-btn" aria-label={en_1.t.firstRun.openFolder} onClick={onOpenFolder}>
        +
      </button>
    </div>
    {projects.status === 'loading' && (<p class="side-note" role="status">
        <states_1.Spinner />
        {en_1.t.loading.realms}
      </p>)}
    {projects.status === 'ready' && projects.data.length === 0 && <p class="side-note">{en_1.t.firstRun.noRealms}</p>}
    {projects.status === 'ready' && projects.data.map(function (row) { return <Row key={row.key} row={row} isSelected={row.key === selected} isDetected={row.key === detected} onPick={onPick}/>; })}
    <div class="side-fill"/>
    <nav aria-label={en_1.t.nav.elsewhere}>
      {LINKS.map(function (link) { return (<a key={link.route} class={link.route === route ? 'side-link on' : 'side-link'} href={(0, routes_1.hrefOf)(link.route)} aria-current={link.route === route ? 'page' : undefined}>
          {link.label}
        </a>); })}
    </nav>
    <update_control_1.UpdateControl engine={engine} isSettings={route === routes_1.ROUTES.settings}/>
  </nav>);
};
exports.Sidebar = Sidebar;
