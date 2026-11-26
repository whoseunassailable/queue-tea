# UI refinement

Quest Q05, shipped in 2.25.0. This page records what the audit found, the shared tokens every screen now draws from, the scroll and window-size decisions, and the visual check still to do on a Mac. The look of the app, the Jade Peaks theme in [workspace-app-design.md](workspace-app-design.md) section 2.1, is unchanged.

## Goal and limits

**Goal.** Make spacing, sizes, scrolling and the loading, empty and failed states consistent across the app, put Notes fourth on the toolbar, take Task activity out of the quest pane, and let more of the window's empty surface drag it.

**Limits.**

- The pixel-art identity stays: the sky, the panels with their gold rule, the pills, Marcellus and Nunito Sans.
- `app/renderer/core/theme/jade_peaks.css` is the mockup's own sheet, minified. It isn't rewritten.
- Home (Q06), the recipe panel (Q07) and the board and planning views (Q11) are being reworked in parallel. Q05 gives them tokens and leaves their own rules alone: the board tools, filters, quest rows, board list, chapters, the active quest title and the empty board.
- Nothing here could be seen in a window. The cloud machine has no Electron or browser, so the visual check is left for a Mac (see [Visual check](#visual-check-on-a-mac)).

**Options weighed.**

1. Rewrite `jade_peaks.css` around tokens. Rejected: it is the approved mockup, and three other quests edit beside it this week.
2. Add a token sheet on `.rm` that names the scale the theme already uses, and move `app.css` onto it. Chosen: every value stays the same, so nothing shifts, and later screens get one place to read sizes from.
3. Tokens per feature. Rejected: the same 12 px gap would end up with five names.

## Tokens

The tokens live in `app/renderer/core/theme/tokens.css`, set on `.rm`. `app/renderer/main.tsx` loads it before `jade_peaks.css` and `app.css`, so both can use it. The colours stay in `jade_peaks.css`, which sets them per sky (`.rm.t-night` and the rest); the token sheet only gives the status colours plain names.

| Group | Tokens | Use |
|---|---|---|
| Spacing | `--space-half` 2 px, `--space-1` 4, `--space-1h` 6, `--space-2` 8, `--space-2h` 10, `--space-3` 12, `--space-3h` 14, `--space-4` 16, `--space-4h` 18, `--space-5` 20, `--space-6` 24, `--space-8` 32 | Any margin, padding or gap. The half steps exist because the mockup uses 6, 10, 14 and 18 px. |
| Padding by role | `--pad-panel`, `--pad-card`, `--pad-sheet`, `--pad-state`, `--pad-field` | The inside of a panel, a card in a panel, a sheet, a state panel, a text field |
| Gaps by role | `--gap-page`, `--gap-stack`, `--gap-inline`, `--gap-tight` | Between a page's panels, stacked rows, buttons in a row, a glyph and its word |
| Type | `--font-body`, `--font-title`, `--font-mono`; sizes `--text-caption` 11 px to `--text-page` 26 px; `--leading-*`; weights `--weight-regular` 400 to `--weight-heavy` 800 | Text. Titles use `--font-title` (Marcellus); branches, paths and commands use `--font-mono`. |
| Shape | `--radius-small` 6 px, `--radius` 8, `--radius-panel` 10, `--radius-pill` 999px | Corners. Panels are 10, buttons and chips are pills. |
| Controls | `--control-small` 24 px, `--control` 28, `--control-tab` 32, `--control-button` 36, `--control-icon` 42 | Heights of chips, rows, tabs, buttons and the round icon buttons |
| Containers | `--width-state` 480 px, `--width-confirm` 480, `--width-sheet` 600, `--width-wide-sheet` 1000, `--width-palette` 600, `--width-detail` 380, `--width-floating-detail` 360, `--width-page` 1100 | The widths a state, a dialog, a sheet, the palette, the detail pane and a page grow to |
| Layers | `--layer-title-bar` 2, `--layer-floating` 4, `--layer-menu` 5, `--layer-scrim` 20, `--layer-toast` 30 | `z-index`. The title strip sits over the panels and under every dialog. |
| Depth and motion | `--shadow-menu`, `--shadow-toast`, `--shadow-float`, `--scrim`; `--ease-out`, `--duration-quick` 0.16 s, `--duration-fill` 1.2 s | Menus, toasts, the floating detail, the dimmed backdrop; hovers and the XP bar filling |
| Status | `--accent`, `--danger` and `--danger-soft`, `--warning` and `--warning-soft`, `--success` and `--success-soft` | Text and backgrounds that say how something went. They point at the theme's XP, Urgent and High chip colours, so they follow the sky. |

When a value isn't on the scale, keep the number and say why in a comment, as the HUD chip's 9 px padding does (the panel's double ring takes 4 px of each edge).

`app/renderer/core/theme/tokens.spec.ts` checks three things on every `npm test`: each `var(--name)` in the renderer's CSS and components is defined in a sheet or set by a component (`--title-bar`, `--z`, `--dx`, `--dy`); no `var()` falls back to a hard-coded colour; and the sheets load in the order above.

## Audit

Found by reading every sheet and screen against the code, at the breakpoints in `app/renderer/core/constants/constants.ts`. "Fixed" means fixed in 2.25.0.

| Screen | What was wrong | Status |
|---|---|---|
| Every screen | About 100 spacing, size, radius and layer values were typed as raw pixels in `app.css`, so the same gap had several spellings | Fixed: moved onto the tokens, value for value. A script checked that each one expands to the number it replaced. |
| Every screen | `--accent` and `--red` were used but never defined, so the hard-coded fallbacks (`#6c9d83` and a raw red) drew instead of the sky's colours | Fixed: `--accent` is the XP jade, and the red is `--danger` |
| Branches, Calendar | Fallbacks on tokens the theme does define (`--ink`, `--pn-solid`, `--mp`) could hide a missing theme value | Fixed: fallbacks removed; the token test fails on any colour fallback |
| Branches | `.branch-page` and `.branch-heading` were each written twice, once without `.rm`, with different padding | Fixed: one rule each, scoped to `.rm` |
| Branches | The 260 px minimum on branch cards could push the page wider than a 720 px window | Fixed: the cards' minimum is `min(100%, 260px)`, and the filter row wraps |
| Branches review | The checks list scrolled inside the review sheet, which scrolls too | Fixed: the sheet does the scrolling |
| Toolbar | Between about 900 and 950 px wide, eight tabs could run past the toolbar | Fixed: the tabs wrap onto a second line rather than overflow. Below 900 px they are still a menu. |
| Sheets and dialogs | A row of action buttons didn't wrap, so a long label pushed a button out of a narrow sheet | Fixed: actions wrap |
| Notes | Its loading state was its own markup, unlike every other screen | Fixed: it uses the shared Loading panel, with the folder it is reading as a hint |
| Every state | The shared Failed panel took only a message, so screens with a second way out drew their own | Fixed: Failed takes an optional title, and any extra action sits beside **Try again** |
| Quest details | **Refresh activity** named a list the pane no longer shows | Fixed: the button reads **Refresh details**, and **Refreshing details…** while it runs |
| Branches | `.graph-scroll`, `.branch-diff`, `.merge-log pre`, `.three-way pre` and the wide review sheet are still unscoped (no `.rm`) | Left as is: scoping them changes their specificity, and Branches works today |

## Scrolling

The page scrolls, and a panel inside it scrolls only when it holds something that can grow without end and the actions around it must stay in reach. These keep their own scroll on purpose:

| Where | Cap | Why |
|---|---|---|
| Branches graph (`.graph-scroll`) | 400 px | It pans both ways |
| Diffs and merge logs | their own height | Long output; the buttons under them stay visible |
| Pickers in Move, Seal and New quest (`.picks`) | 180 px | A long realm would push the dialog's buttons out of reach |
| Free space file list (`.space-files`) | 240 px | The same, in its dialog |
| Live terminal output (`.live-terminal`) | 300 px | It streams |
| Guild replies (`.bubble-reply`, `.bench-reply`) | 240 px | A long answer would bury the helper's card |
| The palette list | up to 420 px | It sits over the page |
| The detail pane | the window's height | It stands beside a list that scrolls on its own |

Notes and Calendar keep their own (version history, canvas picks, the week grid), as their docs describe.

## Window sizes

The window opens at 1280 × 800 and can't go below 720 × 560.

- **1180 px and wider:** sidebar, list and detail side by side.
- **900 to 1179 px:** the detail floats over the list's right edge. The tabs wrap if they run out of room.
- **Below 900 px:** the sidebar folds away behind ☰, the tabs become a **Go to a section** menu, and the detail opens as its own page.

## States

Every view that waits uses the three panels in `app/renderer/core/widgets/states.tsx`:

- **Loading:** the spinner and one line saying what is being read ("Reading your notes…"), with an optional hint under it.
- **Empty:** a title, one line and the one action that fills it.
- **Failed:** an optional title, what went wrong in plain words, **Try again**, and any other way to put it right beside it.

Notes keeps its own failed panel, which adds a ✕ and **Show in Finder** under the same title, line and actions. The panels are covered by `app/renderer/core/widgets/states.spec.tsx`.

## Toolbar order

Home ⌘1, Quests ⌘2, Designs ⌘3, Notes ⌘4, Branches ⌘5, Chronicle ⌘6, Mana & time ⌘7, Calendar ⌘8. The order is one list, `TAB_ORDER` in `app/shared/tabs.ts`, which the tabs, the palette's Go to and the View menu all number from, so they can't disagree.

## Task activity

The quest pane no longer lists task activity. Queue-tea still records the step a quest is on and its commits, for time tracking (Q01) and for Branches, which shows the step when you review the work.

## Window dragging

The 28 px strip across the top of the window and the toolbar's gaps already dragged the window (2.22.0). In 2.25.0 the HUD's row under the tabs drags too, between and after its chips. Buttons, links, fields, the Notes editor, the terminal and every dialog stay `no-drag`, so they press, select and type as before.

## Visual check on a Mac

Q05.9. Run the app with `npm run dev` in `app/` and drag the window's corner to each size.

Sizes: 720 × 560, 1024 × 768, 1280 × 800, 1440 × 900 and 1920 × 1080. Look at each in the Day and Night skies (the sky dial at the right of the toolbar).

At each size, check:

1. Every toolbar tab shows, in the order above, and ⌘4 opens Notes. Below 900 px the **Go to a section** menu lists the same order.
2. No panel, card or sheet runs past the window's right edge, and no button is cut off. Open **New quest**, a Branches review and the palette (⌘K) to see the sheets.
3. Branches cards fit at 720 px, and its filter row wraps.
4. A quest's details show no **Task activity** list, and **Refresh details** works. Branches still shows the current step in a review.
5. One scroll bar at a time in the quest details and the Branches review, apart from the caps listed under Scrolling.
6. Loading and empty panels look alike on Home, Quests, Designs, Notes, Calendar and the Library, and so does any failed panel you come across.
7. The window drags from the top strip, the toolbar's gaps and the HUD row's empty end. Buttons there still press, and text in Notes and the terminal still selects.
8. Colours that used fallbacks before (Branches accents, the Calendar's dots, red error text) match the sky at night.

The e2e checks that cover this are `pages.e2e.ts`, `shell.e2e.ts`, `branch_workflow.e2e.ts`, `realm_time.e2e.ts` and the `notes*.e2e.ts` files: `npx playwright test e2e/shell.e2e.ts` and so on, in `app/`. `shell.e2e.ts` saves screenshots of the narrow layouts.
