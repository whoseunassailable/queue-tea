# Notes performance and guide

Design owner: codex. Scope: task `t-8ba6138d`.

## Goal and limits

Keep capture, search and browsing usable at the existing 5,000-note limit.
Keep the Markdown vault and engine API compatible. Add a guide for someone
starting with a rough idea, and exercise that journey through the real app.

## Options

- Paginate the list. This bounds the rendered rows, uses ordinary buttons,
  and fits the existing folder groups. Browsing a large folder takes another
  action every 100 notes.
- Virtualize the list. This preserves continuous scrolling but needs measured
  folder and note heights, scroll positioning and keyboard focus recovery.
- Fold folders initially. This is smaller but a single large open folder
  still renders thousands of rows.

Use pagination. Search covers every note in the selected view before paging.
Cache normalized search text by immutable note object, so successive searches
reuse it and replacement notes get fresh text. Group in one pass rather than
scan all notes again for every folder or month. Memoize grouping so capture
and unrelated page state do not rerun search.

## List behavior

Use the existing 240 px list, theme, typography and folder controls. Show at
most 100 note rows per page. A folded folder occupies one place, so a realm
with thousands of folders also has bounded rendering. Repeat the folder
heading when its notes continue onto another page. Its count covers all
matching notes in that folder.

Under the groups, show a page count and **Previous notes** / **Next notes**
when there is more than one page. These buttons wrap within the list at
narrow widths. Changing page preserves the open editor, scrolls the list
back up and focuses its first note (or folder when every folder is folded).
Each page has a note reachable by Tab even when the open note is elsewhere.
Arrow keys keep moving between the rendered notes. Enter opens the focused
note. Search, view changes and folding return to page one. Shrinking results
clamps the page to the last available one. The narrow drawer uses the same
controls and still closes on selection or Escape.

Loading, empty, no matches, unreadable files and failures keep their existing
messages and retry controls. An empty list has no paging controls.

## Verification

- Component tests cover paging, focus, search beyond a page and clearing search.
- Domain tests cover split folders, folded folders, empty results, page bounds,
  search semantics and repeated searches over 5,000 substantial notes.
- An Electron test opens a 5,000-note vault, measures browsing and search,
  captures a vague idea, expands it into checklist lines, reviews and files a
  saga, checks the real record and note links, and reopens the saved result.
- The browser budget is 1 second per warm search/page transition and 5 seconds
  to open the vault. These are regression budgets for the fixture, not a
  guarantee for every disk or maximum-size note.
- Run `npm test -- --no-cache`, `npm run typecheck` and the relevant tests with
  `npm run e2e -- notes notes_performance daily_notes note_graph` from `app/`.
  Git-mutating fixture suites stay outside this task's authorized checks.

## Open questions

None block implementation. Use 100 rows per page initially; the named limit
can be adjusted without changing stored data.
