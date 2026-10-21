# Queue-tie: panel redesign

- **Date:** 2026-10-20
- **State:** built 2026-10-20, with Back to queue, the fuller handoff note, the "Claude checked" line and the commit warning. What was built is in "The panel" in [spec.md](spec.md); this note keeps the design as decided. One change from it: the palette is a list of Buttons with keys and a New task field, not a `Select`, because a `Select` option has no dim line under it.
- **Where it came from:** ChatGPT's review of Queue-tie (https://chatgpt.com/share/6ad7f105-0690-83e9-af2a-eae150883219). Beside each of its six points it showed a screenshot of another product. Rohan wants the panel to look like them.

## What Rohan chose

1. **Look:** TaskYou's terminal board, with the sections stacked so it fits the pane beside the chat.
2. **Also:** a handoff card, shortcuts with a palette, and a week chart.

Not included: a Blocked column (Queue-tie has no blocked state) and the dashboards with tiles and several charts (those belong to the weekly board, a separate project).

## The images, described

| Image | What to take from it |
| --- | --- |
| TaskYou, "Kanban for code agents" | Dark terminal board. Each section has a header bar in a solid colour with an icon and a count: `○ Backlog (4)` grey, `▶ In Progress (4)` orange, `⚠ Blocked (2)` red, `✓ Done (3)` green. A task is two or three lines: a dim number, a project tag in magenta (`[storefront]`), the title cut with `…`, then a dim line ("running 2h", "queued 2m", "done 4h"). A dot or pin at the right marks one that needs attention. The selected task has a lighter background. One dim line of key hints at the bottom: `← prev col • → next col • ↑ up • ↓ down • enter view • n new • / filter • ? help` |
| Project handoff picture | A card titled "Project handoff" with numbered sections, each with an icon: 1 Overview (two lines); 2 What's changed (checkboxes, ticked when done); 3 Current state (branch, uncommitted files in red, tests "42 passed" in green); 4 Key context; 5 Next steps (checkboxes); 6 References |
| 1DevTool command palette | A box titled "Command Palette" with a search field ("Type a command or project name") over a list. Each row is a name with a dim line under it saying what it does |
| SignalDeck CI and Developer Metrics | Only the week chart comes from these: bars per day, Mon to Sun, in one colour, with the total beside them |

## The panel, top to bottom

```
Queue-tie · example-app       5h 62% · resets 16:40

█ ▶ In progress ███████████████████████  (orange)
  [high] Go through ChatGPT's Queue-tie ideas
  Medium · task/https-chatgpt… · 12m

█ ○ Up next (8) ██████████████████████  (grey)
★ [urgent] Add a retry button to the scan…
  Hard · waited 29m
  [urgent] Queue-tie: fix queue not loading…
  Hard · waited 19m

█ ✓ Done this week (1) · 1h 14m ███████  (green)
  ✓ Add task log · done 2h
  M ▃  T ▆  W ▁  T █  F    S    S

↑↓ move · enter open · s start · d done · ? help
```

- **Header line:** "Queue-tie · <project>", with the allowance on the right.
- **In progress:** the current task with its priority tag and a dim line (difficulty · branch · time so far). The done question, the git hold with **Check again**, the branch mismatch with **Switch**, and **Continue** stay in this section.
- **Up next:** ★ marks the suggested task. The priority tag is coloured by priority, and the dim line says difficulty and how long it has waited. Pressing a row still opens Start, the priorities and Remove.
- **Done this week:** the count and total in the bar, then this week's finished tasks ("done 2h"), then the week chart. Draw one bar per day from `minutesByDay` with `▁▂▃▄▅▆▇█`. A day with no time is blank.
- **Key hints:** one dim line at the bottom. Hotkeys work only while the panel holds the focus (ctrl+x tab, or a click), so say how to give it focus when it doesn't have it.
- **Loading, empty and failed states:** keep the ones in `spec.md`, drawn in the new style.

### Handoff card

Shown when **Continue** is offered: the latest handoff note as numbered sections (1 Overview, 2 What changed, 3 Current state, 4 Decisions, 5 Next steps). The note is free text from `$.model.fork` today, so its prompt has to ask for these headings. When a heading is missing, show the note as plain text.

### Shortcuts and palette

- One key per action on the panel's Buttons: `s` start, `d` done, `c` continue, `x` remove, `1`–`5` priority (urgent to low). Check that no two clash.
- A palette (`Select`) that lists what can be done now, each with a dim line under it, opened by a key (`p`) and from `/queue-tie`.
- Leave out actions that don't exist yet, such as putting the current task back in the queue.

## What the panel can draw (this build's mod API)

From the types file the plugin-authoring skill lays out (grep `export type BoxProps`, `export type TextProps`, `export type ButtonProps`, `export interface Elements`):

- **Box:** `borderStyle`, `borderColor`, `backgroundColor`, `flexDirection`, `width`, `gap`, `padding`, `justifyContent`, and `hover` overrides.
- **Text:** `color`, `backgroundColor`, `bold`, `dimColor`, `inverse`.
- **Button:** `hotkey` (one digit or one lowercase letter), `plain`, `variant`.
- **Terminal elements:** Box, Text, Button, Input, Select, Link, Code, Markdown, Client, Raster, Image. Desktop has Svg in place of Raster and Image.
- **Colours:** a theme key or a colour string (`export type Color = ThemeKey | …`). Prefer theme keys, so light and dark terminals both read well.

## Where to change it

- Both copies, until the mod is installed from the source folder: `~/Documents/projects/personal_projects/queue-tie/` and the loaded copy at `~/.claude/dev-mods/<session>/queue-tie/`.
- `hooks/ui/panel.tsx` (the panel), `hooks/ui/status.ts` (age and week lines), the handoff prompt, and `tests/ui.test.tsx`.
- Update "The panel" in `spec.md` to match once it is built.
