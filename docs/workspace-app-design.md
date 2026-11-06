# Queue-tea: workspace app UI design

- **Date:** 2026-10-26, decisions 2026-10-27
- **State:** decided, not built. Rohan took every suggested answer on 2026-10-27: List now and Board later, Tea House, the Tea Room read-only, and the answers in section 8. On 2026-10-28 Rohan replaced Tea House with the Jade Peaks look and a game layer (sections 2.1 and 2.2), and the Tea Room became the Guild Hall. The spec built on it is [workspace-app.md](workspace-app.md).
- **Where it came from:** Mocha Mockup wrote it for sub-project 1 of Queue-tea 2.0 (the workspace app), so "I" below is Mocha Mockup. Mockups built from it: https://claude.ai/artifact/H8HpWsfTcZYz5Y1kJBQtUB (private). The Jade Peaks screens are on its "Dragon realm" page, and the other dragon directions on "Dragon directions".
- **The wireframes** use Rohan's real records as of Mon 26 Oct 2026, 17:50, before the folder rename, so this project appears as queue-tie in them. Numbers marked ° are made up for illustration.

## 1. Summary

- **Look:** "Jade Peaks", decided 2026-10-28. A living sky behind every screen follows the clock: a pink morning, a golden day among misty stone peaks, an amber evening, and a lantern night under a jade aurora. Text sits on ivory panels with gold trim by day and on dark jade-ink panels at night. It replaced "Tea House", which is kept in 2.3.
- **Personality:** everywhere, as a game. Tasks are quests, features are sagas, and every victory earns XP and gold. A lóng hatchling on Home reacts to Claude Code and grows as you level up. Work stays readable: lists and text always sit on solid panels.
- **Tasks layout:** a fourth option, the ranked list in state sections (Review, In progress, Backlog, Blocked, Done). Each feature's tasks sit under it, and details open in a pane beside the list.
  - It keeps the ★ order top to bottom and keeps families together.
  - It fits a narrow window and, later, a phone.
  - In progress is already a list of cards, so tasks running side by side won't need a new layout.
- **The Board** (option 1's tab) shows the same data in columns. I'd add it with parallel tasks, when In progress and Review can hold several cards.
- **Guild Hall** (the Tea Room, renamed on 28 Oct): keep it, read-only. Since 6 Nov each helper there takes orders (4.13). Leave Tea Leaves, Obsi-tea, delegation and parallel tasks out entirely, with no placeholders.
- **Decided with Rohan on 2026-10-27:**
  - (a) List now; the Board comes with parallel tasks.
  - (b) Tea House. Neon Lab stays below as the road not taken.
  - (c) The Tea Room ships, read-only.
  - (d) Single-letter keys as in the terminal, off inside text fields, with a switch in Settings.
  - (e) VS Code: open the folder with `code` and show "Paste it in VS Code's terminal" (section 8, question 8).
  - (f) Description and Completion criteria on every task, collapsed when empty.
- **Decided with Rohan on 2026-10-28:**
  - (g) The Jade Peaks look replaces Tea House. The day takes its feel from Liyue in Genshin Impact; the night is a lantern-and-aurora sky.
  - (h) A full game layer: XP, levels, a dragon that grows, a day streak, gold, badges and quests, all worked out from the record.
  - (i) The animated scenery sits behind every screen, with lists and text on solid panels.
  - (j) The sky follows the clock, and Settings can fix it to one time of day.

---

## 2. Visual direction

### 2.1 Chosen: "Jade Peaks"

**Mood.** A fantasy world you look out on while you work. By day it takes its feel from Liyue in Genshin Impact: golden light, karst stone pillars in mist, a red-and-gold pavilion on a cliff, drifting ginkgo leaves and a grown lóng gliding in the distance. By night it's a lantern night: a dark blue-green sky, a jade aurora and paper lanterns rising past the peaks. The art is original. Nothing is taken from the game: no characters, symbols, logos or screens.

**The sky follows the clock.** "Follow my clock" is the default; the sky dial in the toolbar and Settings can fix it to one time.

| Time | Hours | Sky | Panels | What moves |
|---|---|---|---|---|
| Morning | 05:00–09:59 | rose to peach, lavender peaks | light | pink petals fall |
| Day | 10:00–16:59 | blue to a golden haze, jade-green peaks | light | gold ginkgo leaves fall |
| Evening | 17:00–19:59 | indigo, coral, then amber; plum peaks | light | amber leaves fall; the sun sets behind the lair |
| Night | 20:00–04:59 | `#040E1D` down to `#124743` | dark | lanterns rise, a jade and violet aurora sways, stars twinkle |

At every time, mist drifts between the three layers of peaks and the distant lóng glides past.

**Panel tokens.** Panels are 92% opaque by day and 90% at night, over a 10 px backdrop blur, so the sky shows around them but never behind text. Contrast is measured on the panel laid over the darkest sky that can sit behind it.

| Token | Light (morning, day, evening) | Night | Use |
|---|---|---|---|
| `--pn` | `rgba(255,250,238,.92)` | `rgba(8,24,28,.90)` | panels |
| `--card` | `rgba(255,255,255,.70)` | `rgba(255,255,255,.06)` | rows and cards inside panels |
| `--sel` | `rgba(214,240,228,.92)`, jade | `rgba(46,156,126,.22)` | the selected row |
| `--ink` | `#2A2218` | `#F3EDDD` | titles, body |
| `--ink2` | `#54473A` | `#CDC6B4` | meta lines, labels |
| `--ink3` | `#665848` (5.7:1 at worst) | `#BAB3A1` (5.2:1 at worst) | hints, placeholders |
| `--line` | `#B8893A`, gold | `#D4AE5E` | panel rules, corner brackets |
| `--link` | `#8E2A1E`, lacquer | `#F2C66B` | links |

**Accents.** Lacquer red for the main action (`#B23C2B` to `#8E2419`, cream text at 4.8:1 or better). Jade for Finish quest, XP and the selected row (`#62C3A0`, text `#0D3A2C`). Gold for the selected tab, the level badge, earned badges and the ★.

**Chips**, light and night:

| Chip | Light | Night |
|---|---|---|
| Urgent | `#9E1F12` on `#FBE0DC` | `#FFAA9C` on `#4A1A16` |
| High | `#7F430A` on `#FCEBD0` | `#FFC88E` on `#4A3216` |
| Mid | `#334061` on `#E3E8F3` | `#B9C6E6` on `#232C44` |
| XP | `#1B6650` on `#DDF2E8` | `#9CE6C8` on `#123B32` |
| Gold | `#664809` on `#F7EBC8` | `#F3D27A` on `#43381A` |
| Boss quest, badge | `#FFE7A6` on lacquer | the same |

Okay and Low aren't drawn yet.

**Type.** Marcellus for titles, tabs and big numbers; Nunito Sans, weights 400 to 800, for everything else; SF Mono for branches, paths and commands. Tabular numbers for every time and count.

**Shapes.** Panels have a 1 px gold rule, a hairline inside it, and gold lattice brackets at their top corners; radius 10. Buttons, chips and the HUD are pills.

**The dragon.** A golden lóng hatchling coiled on a mossy cliff top beside its eggshell, a pine and a stone lantern, holding a glowing pearl. It has antlers, whiskers, a jade mane and green eyes. Its mood follows the session:

| Session | The dragon |
|---|---|
| none | asleep, eyes shut, Zzz |
| open, idle | awake, blinking |
| a turn is running | puffing steam |
| needs you | a "!" bubble |
| a victory | hops, with sparkles |

Clicking it gets a hop and hearts. It grows with your level (2.2).

**Motion.** Only `transform` and `opacity` animate.
- Loops: falling leaves 18–26 s, lanterns 30–42 s, mist 26 s, the aurora 12–15 s, the distant lóng 46 s, the dragon's float 3.6 s and blink 5 s, the pearl's glow 2.4 s.
- One-off moments: the victory panel rises in 700 ms while coins burst for 1.4 s.
- Reduce Motion, or Calm mode in Settings, stops every loop and the coin burst.

### 2.2 The game layer

Every game number is worked out from the records by pure functions. No game field is stored, and nothing in the game blocks or delays a work action.

**Words on screen.** The engine and the record keep their own words; the screens use these:

| Queue-tea | On screen |
|---|---|
| Tasks, Backlog | Quests, the quest board |
| In progress | Active quest |
| Review | Judgement |
| Blocked, Blocked… | Sealed, Seal… |
| Done | Victory |
| Back to queue | Back to the board |
| History | Chronicle |
| Usage & time; the 5-hour allowance | Mana & time; mana |
| Tea Room | Guild Hall |
| project | realm |
| feature, child task | saga, chapter |
| the ★ suggestion | main quest |
| the current task when it's urgent | boss quest |

**The rules.**
- **XP per victory:** Light 10, Medium 25, Hard 50, by the actual difficulty chosen at Done.
- **Levels:** reaching level L + 1 takes 100 × L XP more than reaching level L, so level 2 is at 100 XP, level 3 at 300, level 5 at 1,000.
- **The dragon's stages:** Egg (level 1), Hatchling (2–4), Young (5–9), Adult (10–19), Elder (20 and up).
- **Streak:** days in a row, in local time, with at least one victory. The best streak is worked out the same way.
- **Gold:** equal to the XP earned, kept as a hoard. There's no shop in this release.
- **Badges:**

| Badge | Earned when |
|---|---|
| First Flame | the first victory |
| Ten Tales | 10 victories |
| Dragon Slayer | 5 victories finished as Hard |
| Saga's End | a saga and all its chapters won |
| Early Bird | a victory between 05:00 and 08:59 |
| Night Owl | a victory between 22:00 and 03:59 |
| Week of Fire | a 7-day streak |

**With the records as of 27 Oct:**
- 5 victories, 120 XP: level 2, 20 of the 200 XP toward level 3, a Hatchling.
- 120 gold: 95 from queue-tea, 25 from Gait-feedback.
- Streak 1 day, best 3 (20–22 Oct).
- First Flame (20 Oct) and Night Owl (27 Oct, 03:30).

**Where it shows:**
- the HUD under the tabs on every screen: level and XP, streak, gold and mana;
- the reward on every quest card;
- the victory panel after Done (4.8);
- a badge toast the moment one is earned;
- the Hoard (4.18).

### 2.3 Not chosen: "Tea House" (chosen 2026-10-27, replaced 2026-10-28)

**Mood.** Calm and cosy, like a well-kept notebook beside the terminal, in the spirit of Things or Bear. Warm neutrals with one accent. The work screens are monochrome apart from the priority and state colours. Delight comes from motion and the cup, never from decoration on rows.

**Core tokens.** Contrast ratios are against the canvas.

| Token | Light | Dark (defined now, switched on later) | Use |
|---|---|---|---|
| `--bg` | `#FBF8F3` | `#1B1815` | window canvas |
| `--bg-sidebar` | vibrancy `sidebar`, fallback `#F4EFE6` | vibrancy, fallback `#221E1A` | sidebar |
| `--surface` | `#FFFFFF` | `#24201C` | cards, detail pane, sheets |
| `--surface-2` | `#F6F1E9` | `#2C2723` | hover, wells, code |
| `--border` | `#E8E0D4` | `#3A332D` | hairlines |
| `--border-strong` | `#D9CEBF` | `#4A4139` | inputs |
| `--text` | `#2B2420` (14.4:1) | `#F3EDE4` | titles, body |
| `--text-2` | `#5A5149` (7.3:1) | `#C9BFB3` | meta lines, labels |
| `--text-3` | `#786D63` (4.8:1) | `#A0958A` (6.0:1) | paths, hints, placeholders |
| `--accent` | `#C8782F`, the cup's tea (3.4:1, non-text only) | `#E09A55` | ★, focus ring, selection bar, steam |
| `--accent-strong` | `#A85F1E` (white text on it 4.9:1) | `#D98A41` with `#1B1815` text (6.4:1) | primary buttons, links |
| `--accent-wash` | `#F6E9DA` | `#3A2A1C` | selected row, drop target |
| `--focus` | `0 0 0 3px rgba(200,120,47,.35)` | `rgba(224,154,85,.45)` | every focusable control |
| `--attention` | `#9A4A06` on `#FFF4E0` | `#F5B36B` on `#3A2817` | "needs you", warnings |
| `--danger` | `#B42318` | `#FF8A7A` | Remove, errors |

**Priority chips.** Each chip has text, a glyph and a tint. Shape and word carry the meaning, so colour is never the only signal.

| Priority | Glyph | Light text on tint | Dark text on tint |
|---|---|---|---|
| Urgent | `!` | `#B42318` on `#FDE8E6` (5.6:1) | `#FF8A7A` on `#3B1F1B` |
| High | `▮▮▮` | `#A4510B` on `#FDF0E2` (5.0:1) | `#F5A65B` on `#3A2817` |
| Mid | `▮▮▯` | `#3F4C63` on `#EEF1F6` (7.6:1) | `#A9B6CF` on `#262B35` |
| Okay | `▮▯▯` | `#3E5B45` on `#EAF2EC` | `#9CC9A5` on `#22302A` |
| Low | `▯▯▯` | `#5A5149` on `#F2EFEB` | `#B8AEA3` on `#2C2723` |

**States.** Each is a glyph plus a word. No fill except Review and Done.

| State | Glyph | Light | Dark |
|---|---|---|---|
| Backlog | ○ | `#5A5149` | `#C9BFB3` |
| In progress | ▶ | `#A85F1E` | `#E09A55` |
| Review | ? | `#5B4BC4` on `#EFEDFB` (6.1:1) | `#B3A8FF` on `#2A2547` |
| Blocked | ⊘ | `#B42318`; the row drops to 72% opacity | `#FF8A7A` |
| Done | ✓ | `#2F7A4B` on `#E8F3EC` (5.0:1) | `#7FD19B` on `#1F3328` |

**Session marks.**

| Mark | Means | Colour |
|---|---|---|
| ≋ | a turn is running | `#A85F1E`, steam animated |
| ● | session open, idle | `#2F7A4B` |
| ? | needs you | `--attention` |
| ○ | no session | `#786D63` |

**Cup palette**, from `hooks/features/tea_cup/domain/services/cup_mood.ts`: cream `#F1DCB2`, clay `#CFAE7B`, tea `#C8782F`, ink `#3A2A20`, pink `#EE9A9A`, sage `#8DB596`, steam `#B9A88C`.

**Bot colours.** The left column is the logo's neon. The other two are the light-UI text and wash colours, for later use.

| Bot | Logo | Text | Wash |
|---|---|---|---|
| Commit Chai-n | `#22D3EE` | `#0E7490` | `#E0F7FA` |
| Mocha Mockup | `#34D399` | `#047857` | `#E3F8EF` |
| Chai-pter | `#FBBF24` | `#A16207` | `#FEF6D8` |
| Tea-DD | `#A78BFA` | `#6D28D9` | `#F1ECFE` |

**Type.** SF Pro through `-apple-system, BlinkMacSystemFont, system-ui`; SF Mono for branches, paths, hashes and commands. Weights 400, 500 and 600 only. Tabular numbers for every time and count.

| Style | Size / line | Weight | Used for |
|---|---|---|---|
| Display | 22/28, −0.2 px tracking | 600 | page titles, project name on Home |
| Title | 17/22 | 600 | card titles, detail-pane title |
| Headline | 13/18 | 600 | section headers, buttons |
| Body | 13/18 | 400, row titles 500 | text, row titles |
| Callout | 12/16 | 400 | meta lines, labels |
| Caption | 11/14 | 500 | chips, counts, sidebar status, key hints |
| Mono | 12/16 | 400 | branches, paths, hashes, commands |

**Spacing, radii, shadows.**
- Spacing uses a 4 px base: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48.
- Radii: 4 for kbd hints; 6 for buttons, inputs and row selection; 10 for cards, popovers and toasts; 12 for sheets and the palette; 999 for chips and pills.
- Shadows, light:
  - `shadow-1` (cards): `0 1px 2px rgba(43,36,32,.06), 0 0 0 1px rgba(43,36,32,.06)`
  - `shadow-2` (popovers, dragged rows, toasts): `0 6px 16px rgba(43,36,32,.12), 0 0 0 .5px rgba(43,36,32,.10)`
  - `shadow-3` (sheets, palette): `0 18px 48px rgba(43,36,32,.20), 0 0 0 .5px rgba(43,36,32,.12)`
- Shadows, dark: the same geometry in `rgba(0,0,0,.5)`, plus a 1 px top highlight `rgba(255,255,255,.04)`.

**Motion.** Only `transform` and `opacity` animate, so everything runs on the GPU. Easing is `cubic-bezier(.2,0,0,1)` going in and `cubic-bezier(.4,0,1,1)` going out.

| What | Duration |
|---|---|
| press, hover | 80 ms |
| chip change, fold-arrow turn, children fading in | 140 ms |
| list reorder (FLIP translateY) | 200 ms |
| detail pane in (translateX 16→0 plus fade) | 200 ms |
| sheet in / out | 240 ms / 180 ms |
| toast in / out | 200 ms / 160 ms; stays 4 s, or 6 s with an action |
| "saved ✓" on a chip | 1.2 s |
| cup steam loop (only while ≋, paused when the window is hidden) | 2.4 s |

Folding never animates height: rows below move with FLIP. With Reduce Motion on, every transition becomes a fade of 120 ms or less and the steam stands still.

Edits are optimistic. The UI changes in the same frame, the record write follows within 300 ms, and a failure reverts the change with a message.

**Where the personality lives.**
- **The cup:** the app icon; the illustration (`icon.png`, 96–120 px) in first run and empty states, with the mood face from `cup.ts` (idle `-ω-`, done `^ω^`, needs you `•o•`); a 16 px cup in the session pill with the same faces and animated steam while Claude Code works; the Tea Room header. It never appears on rows or cards.
- **The bots:** only in the Tea Room this release.
- **The dark logo tiles on light paper:** keep them as they are, shown like Dock icons at 72 px with `shadow-1` and a 1 px `#0000001A` ring. Their rounded dark glass reads as deliberate on paper. Below about 40 px the neon detail turns to mud on white, so no small sizes this release. When delegation lands, draw a 20 px light monogram: the bot's wash, a 1.5 px ring in its text colour, and its symbol.

### 2.4 Not chosen: "Neon Lab"

**Mood.** Crisp, technical and electric, like Raycast or Linear with the bots' world brought into the work screens. Cool white, near-black ink, cyan accent, denser rows (36 px), mono numbers everywhere, and a faint 32 px grid from the logos in empty areas.

**Light tokens.**

| Token | Value |
|---|---|
| bg | `#FFFFFF` |
| sidebar | `#F3F4F8` |
| surface-2 | `#F5F6FA` |
| border | `#E2E4EC` |
| text | `#0F1020` |
| text-2 | `#474A63` |
| text-3 | `#6B6F8A` (4.9:1) |
| accent | `#0891B2` |
| accent-strong | `#0E7490` (white text 5.4:1) |
| ★ | `#D97706` |
| grid | `rgba(15,16,32,.04)` |

- **Priority text** on 8% tints: urgent `#E11D48`, high `#C2410C`, mid `#2563EB`, okay `#047857`, low `#64748B`, all at least 4.7:1.
- **Section strips:** Backlog `#64748B`, In progress `#0891B2`, Review `#7C3AED`, Blocked `#E11D48`, Done `#059669`.
- **Type:** 13/18 body, 15/20 semibold headings, SF Mono for all numbers.
- **Radii:** 8 for cards, 6 for inputs, 4 for chips.
- **Shadows:** none on cards; instead a 1 px border and a 3 px accent glow on focus.
- **Motion:** 120 / 160 ms, and a 600 ms light sweep along the In progress card's edge while Claude works, instead of steam.
- **Personality:** everywhere, a little. 16 px bot tiles act as section icons, and the matching bot appears in empty states (Commit Chai-n on the git hold, Tea-DD on "nothing done").

**Why it comes second.**
- The dark tiles turn muddy at 16 px.
- Five section colours compete with five priority colours.
- Showing helpers on work screens suggests they act from the app, which they don't yet.

### 2.5 Not chosen: the other dragon directions (28 Oct)

- **Pixel Realm:** 16-bit pixel art, a pixel hatchling in its egg on a floating island. The most "game", but pixel type tires the eye in long lists.
- **Candy Kingdom:** a chunky cartoon with a round chibi dragon on a cake island and glossy candy buttons. The most playful, and it can feel childish on work screens.
- **Sky Realm:** painted skies, cumulus clouds and a white cloud-dragon. Jade Peaks is Sky Realm with a Liyue-inspired day, a lóng in place of the winged dragon, and the lantern night.

---

## 3. Information architecture

**Window**
- Default size 1280×800; minimum 720×560. Size and position are remembered per display.
- One unified 52 px title bar: `titleBarStyle: 'hiddenInset'`, traffic lights at x 20, y 18. The bar is a drag region; its controls are `no-drag`.

**Panes**
- Sidebar 248 px, resizable 200–320, collapses below 180. Toggle with ⌃⌘S.
- Content flexes.
- On Tasks and History, the detail pane is 360 px (resizable 320–480).

**Breakpoints**
- 1180 px and wider: three panes.
- 900–1179 px: the detail pane floats over the list's right edge with `shadow-2`.
- Below 900 px: the sidebar folds away (⌃⌘S brings it back as an overlay), the tabs become a menu, and the detail opens as its own page with ‹ Back. That page is the shape the phone app can reuse later.

**Sidebar**, top to bottom:
1. The 52 px bar: traffic lights and [⊟].
2. A "Projects" header (28 px) with **+**, which is Open folder….
3. One row per record in `~/.queue-tea/projects/*.json`, skipping names that start with ".", `.bak`, `.lock` and `.broken-*`. Each row is 44 px:
   - Line 1: the session mark, the name, and the waiting count on the right.
   - Line 2: "Detected" when it applies, then the status. Status, first match wins: Needs you (amber) › Working › ▶ current task › "N waiting · ★ title" › "Nothing queued".
   - An unreadable record shows "⚠ name / Couldn't read".
   - Order is last activity at launch, then stable for the session.
4. Pinned to the bottom: Guild Hall, Hoard and Library (36 px rows), then Settings with the running version on its right, an **Update** button, and one status line (spinner while an update runs, warning colour with **Retry update** when it fails).
5. The project the app was opened from (`queue-tea open`, or `queue-tea://open?path=` from the tea-cup menu) is selected and tagged Detected. Opened without one, the app shows the last project used. On the very first launch with records it shows a "Pick a project" list beside Open folder….

**Navigation**
- Tabs in the toolbar for the selected project: Home ⌘1 (`/home`), Quests ⌘2 (`/quests`), Designs ⌘3 (`/designs`, 4.20), Branches ⌘4 (`/branches`), Chronicle ⌘5 (`/chronicle`), Mana & time ⌘6 (`/mana`). The sky dial sits at the right of the toolbar, and the HUD (level and XP, streak, gold, mana) runs under the tabs on every screen.
- Guild Hall, Hoard, Library and Settings are app-wide pages; Settings is also ⌘,, and it leads with the realm you're in.
- Each project keeps its own tab, selection, scroll, folds, search and Time I have while you switch.

**Project switcher**
- Click a sidebar row.
- ⌥⌘↑ / ⌥⌘↓ for the previous or next project; ⌥⌘1–9 for one by position.
- ⌘K, then type a name.
- In a narrow window, the title popup "Gait-feedback ▾".

**Command palette (⌘K)**
- 600 px wide, 80 px below the toolbar, a 44 px input, 36 px rows with the shortcut on the right.
- Sections: Suggested (actions for the current or selected task), Tasks (fuzzy title and branch match in this project, then others), Actions, Go to, Projects, and Create (`+ New task "<typed text>"`).
- An action that can't run right now shows dimmed with its reason ("Start waits until Finish Insole Bridge… is done or put back").

**Menu bar**
- **Queue-tea:** About, Settings… ⌘,, Install command line tool…, Quit.
- **File:** New task ⌘N, New child task ⇧⌘N, Open folder… ⌘O, Show record in Finder.
- **Edit:** Undo ⌘Z for the app's reversible edits (priority, Play next, move, remove a task), Copy, Find ⌘F.
- **Task:** the letter keys below.
- **View:** tabs, Show sidebar ⌃⌘S, Show detail ⌥⌘I, Command palette ⌘K.
- **Window**, and **Help** (keys and commands).

**Keys.** Single letters work only when focus isn't in a text field. They are the terminal's own letters, and Settings can turn them off.

| Key | Does |
|---|---|
| ↑ ↓ | move the selection (one tab stop for the whole list) |
| ← → | fold or unfold a feature; ← on a child jumps to its feature |
| Return / Space | open the detail |
| s | Start the selected row, or ★ when none is selected |
| ⌘↩ / c | Open in Claude Code |
| d | Done… |
| y / n | Yes / Not yet, in Review |
| b | Back to queue |
| k | Blocked… |
| u | Unblock |
| f | Play next, on or off |
| p | Part of… |
| a | Active feature, on or off |
| t | Time I have: any, 30m, 1h, 2h |
| 1–5 | priority, urgent to low |
| x / ⌫ | Remove… |
| r | Check again, or Try again on a record that can't be read |
| l | Use the last good copy |
| w | Switch to the task's branch |
| o | dismiss the commit warning |
| Esc | close a sheet or palette, clear the search, clear the selection |

- In sheets: ⌘↩ confirms and Esc cancels.
- Focus order: sidebar → toolbar → list → detail. ⌃Tab and ⌃⇧Tab move between panes; Tab moves through a row's controls.

---

## 4. Screens

The wireframes below were drawn before the game layer. Their layout and content still hold; on screen their words change as in 2.2's table, and the look is Jade Peaks (2.1). The mockups' "Dragon realm" page draws each screen in the new look, 4.18 adds the Hoard, and 4.19 the Codex buttons.

**Scale.** 117 columns ≈ 1280 px (about 11 px per column); 40 rows ≈ 800 px (20 px per row; the toolbar row is really 52 px).

**Legend**

| Mark | Means |
|---|---|
| `[[ X ]]` | primary button |
| `[ X ]` | secondary button |
| `( X )` | disabled |
| `X ›` | link |
| `{chip}` / `{chip ▾}` | chip / chip that opens a menu |
| `▍` | selection: 3 px tea bar plus tea wash |
| `*x*` | selected tab |
| `⧉` | copy |
| `★` | the suggestion |
| `◆` | feature |
| `▸` / `▾` | folded / unfolded |
| `▶` | in progress |
| `?` | review |
| `⊘` | blocked |
| `✓` | done |
| `○` | backlog |
| `≋` | a turn is running |
| `●` | session open |
| `◌` / `◐` | working |
| `↥` | Play next |
| `°` | illustrative number |

The toolbar pill is shortened in ASCII. Its real copy is "Working · 5h: 62% · resets 19:40".

### 4.0 The Tasks layout decision

```
TASKS LAYOUT OPTIONS, drawn with Gait-feedback's tasks
┌─ 1  List, with a Board tab ───────────────────────────┐  ┌─ 2  One board, a lane per feature ────────────────────┐
│ [*List*|Board]                                        │  │              Backlog Blocked In prog Review  Done     │
│ ★ ▾ Fix the documentation                    ! Urgent │  │ Fix the docs [Move…] ·       ·       ·       ·        │
│       Move homepage parts elsewhere…         ▮▮▮ High │  │              [◆feat]                                  │
│     Fix cut-off text in docs diagr…          ▮▮▮ High │  │ Insole Bri…  ·       ·       [Fini…] ·       ·        │
│     Refocus 'who uses it' diagram…           ▮▮▮ High │  │ On its own   [Fix c…]·       ·       ·       [✓ Co…]  │
│ Board tab: Backlog | Blocked | In progress | Review | │  │              [Refo…]                                  │
│ Done, each card naming its feature                    │  │              [Fix p…][Anal…]                          │
└───────────────────────────────────────────────────────┘  └───────────────────────────────────────────────────────┘

┌─ 3  Columns only; a feature has its own page ─────────┐  ┌─ 4  Ranked list in state sections (recommended) ──────┐
│ Backlog              Blocked In prog Review  Done     │  │ ? Review       only while a task waits on you         │
│ [◆ Fix do…›]         ·       [Fini…] ·       [✓ Co…]  │  │ ▶ In progress  [ Finish Insole Bridge… card ]         │
│ [Fix cut-off]                                         │  │ ○ Backlog 6    ★ ▾ Fix the documentation              │
│ [Refocus …]                                           │  │                      Move homepage parts…             │
│ [Fix privacy]                                         │  │                    Fix cut-off text…  (rank order)    │
│ [Analyse …]                                           │  │ ⊘ Blocked 0                                           │
│ Fix do… › opens its own page with its 1 task          │  │ ✓ Done 1       details open in the pane beside it     │
└───────────────────────────────────────────────────────┘  └───────────────────────────────────────────────────────┘
```

In plain terms:
- **1** is a to-do list with a Kanban tab.
- **2** is a grid of states by feature.
- **3** is Trello with folders.
- **4** is the to-do list sorted onto five shelves.

| | 1 List + Board tab | 2 Lane per feature | 3 Columns, feature page | 4 Sections (recommended) |
|---|---|---|---|---|
| ★ order visible | in List only | no, split across lanes | no; a feature hides its tasks | yes, top to bottom |
| Families together | List yes; Board names the feature on each card | yes | only on the feature's page | yes, under their feature |
| Several in progress later | Board good | good | good | good: In progress holds a list of cards; Review gets its own section |
| Narrow window, phone later | List yes; Board scrolls sideways | poor (5 columns × lanes) | poor | best: one column |
| Build and test cost | two layouts | one complex grid | one layout plus a page | one list plus the detail pane |

**Decided: option 4.** It is option 1's list with the states as sections and a detail pane, and no Board for now. The Board is the same data re-laid in columns, so it can come with parallel tasks (sub-project 4) without new data.

### 4.1 Home

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ [*Home*|Tasks|History|Usage & time]         ≋ Working · 5h 62% · 19:40   [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │   Gait-feedback                                                                           │
│▍≋ Gait-feedback     6 │   ~/Documents/projects/company_projects/Gait-feedback                                     │
│▍  Detected · Working  │                                                                                           │
│                       │   ┌─ Now ────────────────────────────────────────────────────────────────────────┐        │
│ ● queue-tie           │   │ ▶ In progress · 43m so far · started 20 Oct 22:17                 {! Urgent} │        │
│   ▶ Rename project fr…│   │ Finish Insole Bridge to test the music orb and muffling                      │        │
│                       │   │ task/finish-insole-bridge-to-test-the-music-orb-and-muf ⧉ · Hard             │        │
│                       │   │ ◆ Active feature · 4 improving messages · 33 files read · 39 changed         │        │
│                       │   ├──────────────────────────────────────────────────────────────────────────────┤        │
│                       │   │ ≋ Claude Code is working on it · a turn is running                           │        │
│                       │   │                                                                              │        │
│                       │   │ [[ Open in Claude Code ]]  [ Done… ]  [ Back to queue ]  [ Blocked… ]    [⋯] │        │
│                       │   └──────────────────────────────────────────────────────────────────────────────┘        │
│                       │                                                                                           │
│                       │   Up next · 6 can start · 0 blocked                             Time I have: any ▾        │
│                       │   Start opens when Finish Insole Bridge… is done or back in the queue.                    │
│                       │   ★ ▸ Fix the documentation                                             {! Urgent}        │
│                       │       ◆ 0/1 done ▱▱▱▱▱ · Hard · ~3h 46m · waited 4d · task/fix-documentation · 14m so far │
│                       │       ★ urgent                                                                            │
│                       │       Fix cut-off text in docs diagrams and add checks                  {▮▮▮ High}        │
│                       │       Medium · ~1h 30m · waited 6d                                                        │
│                       │       Refocus 'who uses it' diagram on elderly users                    {▮▮▮ High}        │
│                       │       Light · ~30m short · waited 6d                                                      │
│                       │       All 6 in Tasks ›                                                                    │
│                       │                                                                                           │
│                       │   This week  M █  T  W  T  F  S  S   0 done · 2h 18m     Last week 1 done · 5h 54m        │
│                       │   Recently done                                                                           │
│                       │   ✓ Correct privacy, battery alert, history and portal claims · 20 Oct · 42m · Medium     │
│                       │                                                                                           │
│                       │   Other projects                                                                          │
│                       │   ● queue-tie   ▶ Rename project from queue-tie to queue-tea · 3m         [ Open ]        │
│                       │       Claude Code open · nothing waiting · 3 done                                         │
│ ◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

**Measurements**
- Content padding: 24 px at the sides, 20 px at the top. Content width is at most 880 px, left-aligned.
- Header: project name in Display; path in Mono, text-3; 4 px between them, 24 px below.
- Now card (about 210 px tall):
  - radius 10, padding 16, `shadow-1`
  - status line in Callout with the 24 px chip on the right
  - title in Title, two lines at most; branch line in Mono; effort line in Callout, text-2
  - 1 px divider with 12 px above and below; session line in Body
  - a 28 px button row with 8 px gaps and ⋯ on the right
- Up next:
  - header row 24 px with the Time I have control on the right; hint line in text-3
  - rows 44 px, or 60 px for the ★ row
  - three entries at most, and a feature counts as one; then the "All 6 in Tasks ›" link
- This week: a 32 px row; the mini chart has 7 bars, each 6 px wide and up to 16 px high, with 4 px gaps.
- Recently done: up to 3 rows of 24 px.
- Other projects: 44 px rows with [ Open ].

**States**
- **No task in progress:** "No task in progress." with [[ Start ★ Fix the documentation ]] and "★ urgent". [ Start in Codex ] sits beside Start (4.19).
- **Start:** the hold card replaces the Now card (4.6), and the working lines show inside it.
- **Review:** the Review card replaces the Now card (4.7).
- **Drift**, in amber under the meta line ("! The branch task/now is gone."). This comes from `readDrift`/`checkLines`.
- **Branch mismatch:** "You're on main, not task/finish-insole-bridge-…" with [ Switch ] (w). With uncommitted work: "…: commit or stash first, then Switch."
- **Commit warning:** an amber strip at the top of the content: "⚠ During the last turn a commit appeared: 1a2b3c4 …" with [ OK ] (o).
- **Not a git repository:** an info line under the header, "Not a git repository, so no branches are made".
- **Session lines, empty, loading, failed:** see 4.16 and 4.15.

### 4.2 Tasks, with a feature in the detail pane

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ [Home|*Tasks*|History|Usage & time]       ≋ Working · 5h 62% · 19:40  [⌕ Search ] [⚲] [+] │
├───────────────────────┼─────────────────────────────────────────────────────────┬─────────────────────────────────┤
│                       │                                                         │ ◆ Feature · ○ Backlog         ✕ │
│ Projects            + │ ▶ In progress 1                                         │                                 │
│▍≋ Gait-feedback     6 │ ┌─────────────────────────────────────────────────────┐ │ Fix the documentation           │
│▍  Detected · Working  │ │ ▶ In progress · 43m so far               {! Urgent} │ │ {! Urgent ▾} {Hard ▾}  ~3h 46m  │
│                       │ │ Finish Insole Bridge to test the music orb and      │ │ ( Start ★ )  [ Play next ]  ⋯   │
│ ● queue-tie           │ │ muffling                                            │ │ Start waits until Finish Insole │
│   ▶ Rename project fr…│ │ task/finish-insole-bridge-to-test-the… ⧉ · Hard     │ │ Bridge… is done or put back.    │
│                       │ │ ◆ Active feature                                    │ │ ─────────────────────────────── │
│                       │ │ ≋ Claude Code is working on it                      │ │ ★ Suggested · urgent            │
│                       │ │ [[Open in Claude Code]] [Done…] [Back to queue] ⋯   │ │ Progress   ▱▱▱▱▱ 0 of 1 done    │
│                       │ └─────────────────────────────────────────────────────┘ │                                 │
│                       │                                                         │ Description                     │
│                       │ ○ Backlog 6                          Time I have: any ▾ │ Add a description…              │
│                       │   ◆ Active feature: Finish Insole Bridge…   Clear       │ Use the checkpoint's goal ›     │
│                       │▍★ ▾ Fix the documentation                    {! Urgent} │                                 │
│                       │▍    ◆ 0/1 done ▱▱▱▱▱ · Hard · ~3h 46m · waited 4d       │ Completion criteria             │
│                       │▍    ★ urgent                                            │ + Add a criterion               │
│                       │       Move homepage parts elsewhere; add p…  {▮▮▮ High} │ Use its 5 acceptance criteria › │
│                       │       Light · ~30m short · waited 4d                    │                                 │
│                       │       + Add child task                                  │ Tasks in this feature 1         │
│                       │     Fix cut-off text in docs diagrams and…   {▮▮▮ High} │ ○ Move homepage parts el… ▮▮▮   │
│                       │     Medium · ~1h 30m · waited 6d                        │ + Add child task                │
│                       │     Refocus 'who uses it' diagram on elde…   {▮▮▮ High} │ ─────────────────────────────── │
│                       │     Light · ~30m short · waited 6d                      │ ▸ Checkpoint · 25 Oct 12:37     │
│                       │     Fix privacy, battery alert, history a…   {▮▮▮ High} │ ▸ Filed with · 1 message        │
│                       │     Medium · ~1h 30m · waited 6d                        │ Branch task/fix-documentation ⧉ │
│                       │     Analyse new recordings: false steps a…    {▮▮▯ Mid} │ Filed 22 Oct · waited 4d · 14m  │
│                       │     Medium · ~1h 30m · waited 6d                        │ ◆ Make it the active feature    │
│                       │                                                         │ Remove…                         │
│                       │ ⊘ Blocked 0                                             │                                 │
│                       │ ✓ Done 1 · last 20 Oct                           Show ▸ │                                 │
│                       │                                                         │                                 │
│                       │                                                         │                                 │
│ ◇ Tea Room            │                                                         │                                 │
│ ⚙ Settings            │                                                         │                                 │
│                       │                                                         │                                 │
└───────────────────────┴─────────────────────────────────────────────────────────┴─────────────────────────────────┘
```

**Section order:** ? Review (only while a task waits for Rohan's answer), ▶ In progress, ○ Backlog, ⊘ Blocked, ✓ Done. The order inside Backlog is exactly `rankBacklog`, grouped by `groupBacklog`.

**List pane**
- At least 420 px wide, padding 12.
- Section headers are 32 px and stick to the top: glyph, name and count in text-3, with the section's control on the right.
- Rows are 44 px, or 60 px with the ★ line. The 12 px left gutter holds the 3 px selection bar, then a 20 px ★ slot and a 20 px fold slot. A child is indented 20 px more.
- The priority chip sits at the right with 12 px of padding.
- "+ Add child task" is a 28 px ghost row in text-3 that turns tea on hover.

**Detail pane**
- 360 px, padding 16, scrolls on its own.
- 32 px header; the title (Title style) becomes editable on click; 28 px control row.
- 1 px separators with 12 px margins; section labels in Callout semibold, text-2.

**Filters.** [⚲] opens a popover: priority ×5, difficulty ×3, state ×5, "Only the active feature", "Fits Time I have". Active filters show as a 28 px chip row under the toolbar with "Clear all".

**States**
- Backlog empty: "Nothing waiting."
- Everything blocked: "Nothing can start: every task waiting is blocked."
- Blocked rows drop to 72% opacity, with a ⊘ line from `blockedText()`.
- A section with nothing in it shows its header only ("⊘ Blocked 0"); Done starts collapsed.
- Start stays available for another queued, unsealed quest. Each new app start gets its own branch and worktree; Home and Quests show every current task. Branches sits next to Quests and connects saved base branches to quest cards. See [parallel quests](spec.md#parallel-quests-and-branches); older wireframes below predate this behavior.
- After a Done, the ★ row takes focus.
- Search with no match: 'No tasks match "diagram".' with [ Clear search ].

### 4.3 A feature's panel

This is the right pane in 4.2, shown for a feature.

**Header:** "◆ Feature · <state chip>". Description and Completion criteria are new fields.
- "Use the checkpoint's goal ›" fills Description from `checkpoint.goal`. It shows only when that goal exists. For Fix the documentation it is: "Fix the documentation: the Docusaurus site in docs/, which renders every part's Markdown plus the product pages in docs/guide/."
- "Use its 5 acceptance criteria ›" copies `checkpoint.acceptance` into Completion criteria.

**Variants**
- **Queued:** shows Start ★ / Start and Play next.
- **Current:** its In progress card shows "◆ 0/1 done ▱▱▱▱▱". The panel lists its children with ○ / ⊘ / ▶ / ✓, in the backlog's order: those that can start, then blocked, then ▶ and ✓.
- **Done:** read-only.
- **★ inside the feature** while folded: "★ Suggested: Move homepage… · high".
- **Active feature:** a tag, and "◆ Turn off" in place of "Make it the active feature". Clear also works on the list's "◆ Active feature" line.
- **Remove…** opens a confirmation (4.9).

### 4.4 A task's detail: current, queued and done

```
┌───────────────────────────────────┐  ┌───────────────────────────────────┐  ┌───────────────────────────────────┐
│ ▶ In progress                   ✕ │  │ ○ Backlog                       ✕ │  │ ✓ Done · 20 Oct 17:35           ✕ │
│ Finish Insole Bridge to test the  │  │ Fix cut-off text in docs          │  │ Correct privacy, battery alert,   │
│ music orb and muffling            │  │ diagrams and add checks           │  │ history and portal claims         │
│ {! Urgent ▾} {Hard ▾}             │  │ {▮▮▮ High ▾} {Medium ▾} ~1h 30m   │  │ {▮▮▮ High} · Medium → Medium      │
│ ≋ Claude Code is working on it    │  │ ( Start )  [ Play next ]  ⋯       │  ├───────────────────────────────────┤
│ [[ Open in Claude Code ]]         │  │ Start waits until Finish Insole   │  │ Time    42m · 16:53 – 17:35       │
│ [ Done… ] [ Back to queue ]  ⋯    │  │ Bridge… is done or put back.      │  │ Effort  6 improving messages      │
├───────────────────────────────────┤  ├───────────────────────────────────┤  │ Files   2 read · 16 changed       │
│ Time    43m · since 20 Oct 22:17  │  │ Part of   On its own  Part of… ▾  │  │ Lines   +958 −799 · 27 files      │
│         today 19m                 │  ├───────────────────────────────────┤  │ Branch  task/correct-privacy-b… ⧉ │
│ Effort  4 improving messages      │  │ Description                       │  │ From    c1fc035                   │
│ Files   33 read · 39 changed      │  │ Add a description…                │  │ Log     docs/task_log.md ✓        │
│ Lines   +812 −95 since 1649ade °  │  │ Completion criteria               │  ├───────────────────────────────────┤
│ Git     task/finish-insole-bri… ⧉ │  │ + Add a criterion                 │  │ ▸ Filed with · 1 message          │
│         7a2ecc7 changed homepage… │  ├───────────────────────────────────┤  │ [ File a follow-up… ]             │
│         20 files not committed ▸  │  │ Filed with · 1 message            │  │ Coming back to a finished task    │
├───────────────────────────────────┤  │ “On the docs guide or other       │  │ files a new one.                  │
│ Checkpoint · 26 Oct 16:35       ▾ │  │ diagrams that we have made, I can │  └───────────────────────────────────┘
│ 1 Goal                            │  │ see that the text inside the      │
│   Get the music, orb and muffling │  │ boxes is incomplete or cut off…”  │
│   testable on Rohan's Samsung…    │  │ Show all ▾                        │
│ 2 Acceptance criteria 4         ▸ │  ├───────────────────────────────────┤
│ 3 Changes made ✓ 6              ▸ │  │ Filed 20 Oct 16:42 · waited 6d    │
│ 4 Decisions 4                   ▸ │  │ Branch when it starts             │
│ 5 Approaches rejected 2         ▸ │  │ task/fix-cut-off-text             │
│ 6 Remaining ☐ 5                 ▸ │  ├───────────────────────────────────┤
│ 7 Blockers 1                    ▸ │  │ [ Blocked… ]   Remove…            │
│ 8 Next action ☐                   │  └───────────────────────────────────┘
│   Ask Rohan whether to copy com.… │
├───────────────────────────────────┤
│ ▸ Filed with · 1 message          │
│ ◆ Active feature · Turn off       │
│ Part of…   Blocked…               │
└───────────────────────────────────┘
```

**Helpers row.** Queued and in-progress panels show it, below the other task details; a done task does not.

```
│ Helpers                           │
│ [Commit Chai-n] [Mocha Mockup]    │
│ [Chai-pter] [[Tea-DD]]            │
```

- **Helpers** are four toggle chips, each with its logo and name. A pressed chip (double brackets) means Claude uses that helper on this quest. A click saves, like the priority control; a change on the task in progress reaches Claude on its next reply. If saving fails, the chip goes back and a message says so, as for a failed description edit.
- **The checkpoint card** uses `checkpointSections`: numbered, collapsible, Remaining and Next action shown as ☐, Changes made as ✓. A plain handoff note that is newer shows as 1 Overview … 5 Next steps (`cardNote`).
- **Lines.** The app measures them itself: `diffSince(startCommit)` when the pane opens, then every 30 s while it is visible.
- **"Branch when it starts"** comes from `slugBranch(title, listBranches())`. The name shown is real: the engine gives `task/fix-cut-off-text`.
- **File a follow-up…** opens New task with "Follow up: <title>", since a finished task can't be reopened.

### 4.5 New task, and Add child task inline

```
NEW TASK (sheet, 600 px)
┌─ New task · Gait-feedback ─────────────────────────────────┐
│ Title                                                      │
│ [ Rebuild the iPhone apps                              ]   │
│                                                            │
│ Priority  ! Urgent ▮▮▮ High [▮▮▯ Mid] ▮▯▯ Okay ▯▯▯ Low     │
│ Difficulty  Light  [Medium]  Hard                  ~1h 30m │
│                                                            │
│ Part of                                 nothing picked yet │
│ ○ On its own                                               │
│ ○ ◆ Finish Insole Bridge to test the music orb… · active   │
│ ○ ◆ Fix the documentation · 0/1 done                       │
│ ○ New feature…                                             │
│ Another open task ▾                                        │
│                                                            │
│ ▸ Description and completion criteria (optional)           │
│                                                            │
│ ⚠ Pick what it is part of first, or On its own.            │
│ It waits in the backlog until you press Start.             │
│                          [ Cancel ]  ( Add to backlog ⌘↩ ) │
└────────────────────────────────────────────────────────────┘

ADD CHILD TASK (inline, in the list under its feature)
  ▍★ ▾ Fix the documentation                        {! Urgent}
         Move homepage parts elsewhere; add priv…   {▮▮▮ High}
         [ Check every guide page for cut-off text   ] {▮▮▯ Mid ▾} {Medium ▾}
         ↩ add · esc cancel · part of Fix the documentation
```

A Helpers line sits between Difficulty and Part of, with Tea-DD pressed:

```
│ Helpers                                                    │
│ [Commit Chai-n] [Mocha Mockup] [Chai-pter] [[Tea-DD]]      │
```

**Sheet layout**
- 600 px wide, padding 20.
- 13 px labels in a 96 px column; 28 px segmented controls.
- Part of options are 28 px radio rows.

**Behaviour**
- Priority defaults to mid, the engine's default; difficulty defaults to medium.
- The offered features come from `filingCandidates`. "Another open task ▾" lists `loneTasks` (and, through Part of…, `parentChoices`), so a broad task can take its first piece.
- With an active feature, nothing is picked and the button waits, as in the spec. Inline "+ Add child task" counts as the pick.
- Filing never starts a task.
- Afterwards, the toast "Queued: Rebuild the iPhone apps (mid) · part of Finish Insole Bridge…".
- On failure: "Couldn't save the task. Try Save again." The sheet stays open.
- A refusal from `parentRefusal` shows in red under Part of.

### 4.6 The Start flow and the git hold

This is a real case. After Back to queue on Insole Bridge, its 20 uncommitted files would hold the next Start.

```
START · 1 the git check fails: the hold card (Home's Now card, Tasks' In progress slot)
┌─ Waiting to start ───────────────────────────────────────────────────────────┐
│ ⚠ Fix the documentation can't start yet: 20 files not committed              │
│ On task/finish-insole-bridge-to-test-the-music-orb-and-muf, 7a2ecc7          │
│                                                                              │
│ Not committed                                                                │
│   CLAUDE.md                       docs/CLAUDE.md                             │
│   README.md                       docs/docusaurus.config.ts                  │
│   analysis/README.md              docs/guide/build_on_it/README.md           │
│   backend/README.md               +13 more ▸                                 │
│                                                                              │
│ Commit or stash them yourself, then check again. Nothing has changed:        │
│ no branch was made and the task is still in the backlog.                     │
│   git status ⧉                                                               │
│                                                                              │
│ [[ Check again ]]  [ Cancel ]                                        r · esc │
└──────────────────────────────────────────────────────────────────────────────┘

START · 2 its other reasons, from holdReason()
   2 commits not pushed                      git push ⧉
   3 files not committed · 2 commits not pushed
   This branch has never been pushed         git push -u origin task/finish-insole-bridge-… ⧉
   Detached HEAD: check out a branch first   git switch <branch> ⧉

START · 3 the check passes: one working line on the card, then the hand-over
   ◌ Checking git…
   ◌ Switching to task/fix-documentation…          (put back before: its own branch)
   ◌ Making task/fix-cut-off-text from task/finish-insole-bridge-…   (a first start)
   ◌ Handing it to Claude Code… it clears the conversation and sends the first message
   ◌ Claude Code takes it when this turn ends.                 [ Open in Claude Code ]
   ◌ Opening Claude Code in iTerm2…                            (no session open here)
   ≋ Claude Code is working on it                              (the session took it)
   Toast: Started: Fix the documentation · task/fix-documentation

START · 4 refused
   Finish Insole Bridge to test the music orb and muffling was started first, maybe in
   another session, so Fix the documentation waits in the backlog.
   Couldn't open iTerm2.  [ Try again ]  [ Copy: cd ~/…/Gait-feedback && claude ⧉ ]
```

- Commands are copy-only. The app never commits, pushes or merges, so no such button exists.
- The hold is view state and isn't saved.
- **With a session open,** Start adds a `begin` request to the record. The mod takes it at a safe point: no turn running and an empty prompt box. Otherwise the mod offers Continue there.
- **With none,** the app opens the terminal chosen in Settings, running `claude` in the project.
- **Not a git repository:** the notice "Not a git repository, so no branches are made", and the task starts.
- **The task's branch was deleted:** "task/x was gone, so this task starts again on task/y, made from main."

### 4.7 Review

```
REVIEW (Home's Now card; in Tasks the card sits under '? Review 1')
┌─ Review ─────────────────────────────────────────────────────────────────────┐
│ ? Is Fix the documentation done for now?                          {! Urgent} │
│ Claude checked: docs build and typecheck pass on 9523996; Rohan confirmed    │
│ nothing more is needed                                                       │
│ 14m so far · task/fix-documentation · Hard                                   │
│                                                                              │
│ [[ Yes, finish it… ]]  [ Not yet ]  [ Open in Claude Code ]            y · n │
└──────────────────────────────────────────────────────────────────────────────┘
```

- The "Claude checked" line is the one this task's real checkpoint tells Claude to send. It appears when `task.review` is set (new field).
- The pill turns "? Needs you", and the sidebar's line 2 turns amber: "Needs you · done for now?".
- **Yes** opens Done (4.8). **Not yet** clears `review`.
- If the task has completion criteria, they show under the Claude checked line.

### 4.8 The Done flow

```
DONE · the sheet: a project with a task log (left) and the first finish in queue-tie (right)
┌─ Finish Fix the documentation ─────────────────────────────┐  ┌─ Finish Rename project from queue-tie to queue-tea ────────┐
│ How hard was it?                                           │  │ How hard was it?                                           │
│ Light   Medium   [Hard · expected]                         │  │ [Light · expected]   Medium   Hard                         │
│                                                            │  │                                                            │
│ 14m · task/fix-documentation · 1 improving message         │  │ 3m · task/rename-project-queue-tie · 1 improving message   │
│ Lines are measured from git when you finish.               │  ├────────────────────────────────────────────────────────────┤
│ A row goes into docs/task_log.md as an uncommitted         │  │ Where should this project's task log go?                   │
│ change, ready for your next commit.                        │  │ [ docs/task_log.md                                    ]    │
│                                                            │  │ This is the first task finished here. Queue-tea adds a     │
│                                [ Cancel ]  [[ Finish ⌘↩ ]] │  │ row there for each one, as an uncommitted change.          │
└────────────────────────────────────────────────────────────┘  │                                                            │
                                                                │                                [ Cancel ]  [[ Finish ⌘↩ ]] │
                                                                └────────────────────────────────────────────────────────────┘

DONE · after
   Toast: Done: Fix the documentation · 14m · row added to docs/task_log.md
   Now card: No task in progress.   [[ Start ★ Finish Insole Bridge to test the music orb and muffling ]]
   Failed log write: Couldn't write the task log at docs/task_log.md   [ Try again ]
```

- Done… (d) opens this sheet directly; Review's Yes opens it too.
- queue-tea has no `docsLogPath`, so its first finish asks for one. Gait-feedback already has `docs/task_log.md`.
- While it works, the primary button reads "◌ Finishing…".
- **Victory:** once the record and the log row are written, the victory panel shows the XP and gold earned, and any level-up or new badge. Back to the lair or Esc closes it. It never holds up the write.

### 4.9 Back to queue, Blocked…, Move and Remove

```
BACK TO QUEUE (b) · the card while it works, and the notice without a session
   ◌ Saving a checkpoint… Claude writes it, then the task goes back.
   ◌ Claude Code saves a checkpoint when this turn ends.   [ Put it back now, without one ]
   Toast: Back in the backlog: Finish Insole Bridge to test the music orb and muffling
   ⚠ No Claude Code session was open, so Claude's checkpoint wasn't written. Start carries
     on from the checkpoint of 26 Oct 16:35 and what Queue-tea saw.   (in its detail pane)

BLOCKED… (k), then the feature dialogs: Move (drag or Part of…) and Remove a feature
┌─ Blocked… ─────────────────────────────────────────────────┐  ┌─ Move to another feature? ─────────────────────────────────┐
│ What does Analyse new recordings: false steps and          │  │ Move homepage parts elsewhere; add privacy footer          │
│ background dropouts wait for?                              │  │ note moves from Fix the documentation (0/1 done) to        │
│                                                            │  │ Finish Insole Bridge to test the music orb and muffling.   │
│ [⌕ Filter tasks                                     ]      │  │ Its priority, branch and time stay as they are.            │
│ 1  ▶ Finish Insole Bridge to test the music orb and…       │  │                                     [ Cancel ]  [[ Move ]] │
│ 2  ◆ Fix the documentation                                 │  └────────────────────────────────────────────────────────────┘
│ 3    Move homepage parts elsewhere; add privacy foo…       │
│ 4    Fix cut-off text in docs diagrams and add checks      │  ┌─ Remove Fix the documentation? ────────────────────────────┐
│ 5    Refocus 'who uses it' diagram on elderly users        │  │ Its 1 task stays in the backlog, on its own.               │
│ 6    Fix privacy, battery alert, history and portal…       │  │ The branch task/fix-documentation stays in git.            │
│                                                            │  │                                   [ Cancel ]  [[ Remove ]] │
│ Or a reason                                                │  └────────────────────────────────────────────────────────────┘
│ [ waiting for the clinic's new recordings           ]      │
│                                    [ Cancel ]  [[ Block ]] │
└────────────────────────────────────────────────────────────┘
```

- **Back to queue** keeps the branch, start commit, time and priority.
- **Blocked…** lists only `canWaitFor` tasks, with keys 1–9.
  - On the current task it adds "It goes back in the backlog with a checkpoint."
  - Afterwards, the toast "Blocked: <title>".
  - The blocked reason in this example is illustrative: in the record, Analyse is queued.
- **Move:** dragging onto a feature row, or using Part of…, asks first. Afterwards, the toast "Part of <feature>: <task>". A move that `parentRefusal` refuses shows its sentence and changes nothing.
- **Remove:** a plain task is removed at once with an Undo toast. A feature asks first, because its children change.

### 4.10 History (here: All projects, last week)

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ [Home|Tasks|*History*|Usage & time]         ≋ Working · 5h 62% · 19:40   [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │   History                                             [ This project | *All projects* ]   │
│▍≋ Gait-feedback     6 │   ‹  19 – 25 Oct  ›                                                         This week ›   │
│▍  Detected · Working  │                                                                                           │
│                       │   4 done · 8h 47m · 3h 23m in tasks, 5h 24m outside · 2 as expected, 1 harder, 1 easier   │
│ ● queue-tie           │                                                                                           │
│   ▶ Rename project fr…│                ░░░░░                                                                      │
│                       │                ░░░░░                 ░░░░░                                                │
│                       │                █████      ░░░░░      ░░░░░                                                │
│                       │                █████      ░░░░░      ░░░░░                            ░░░░░               │
│                       │                █████      ░░░░░      █████      ░░░░░                 ░░░░░               │
│                       │                █████      █████      █████      ░░░░░      █████      ░░░░░               │
│                       │     Mon 19     Tue 20     Wed 21     Thu 22     Fri 23     Sat 24     Sun 25              │
│                       │     —          2h 39m     1h 37m     2h 11m     54m        <1m        1h 24m              │
│                       │                                                                                           │
│                       │   █ in tasks   ░ outside tasks                                                            │
│                       │                                                                                           │
│                       │         Task                           Project        Finished    Time  Expected → actual │
│                       │   ─────────────────────────────────────────────────────────────────────────────────────── │
│                       │   ✓ !   Short branch names and paren…  queue-tie      Thu 22 Oct  25m   Hard → Medium     │
│                       │   ✓ ▮▮▯ Feature-parity audit of the …  queue-tie      Thu 22 Oct  16m   Medium → Hard     │
│                       │   ✓ !   Rename queue-tie to queue-tea  queue-tie      Wed 21 Oct  2m    Light → Light     │
│                       │   ✓ ▮▮▮ Correct privacy, battery ale…  Gait-feedback  Tue 20 Oct  42m   Medium → Medium   │
│                       │                                                                                           │
│                       │   ‹ Earlier weeks · Pressing a row opens it in the detail pane, with File a follow-up…    │
│                       │                                                                                           │
│ ◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Chart:** 140 px tall, 48 px bars with 64 px gaps, stacked tasks then outside time. Hovering shows "Thu 22 Oct · 2h 11m (54m in tasks, 1h 17m outside)".
- **Table:** 32 px rows. Columns: glyph 56 px, task flex, project 150, finished 120, time 64, difficulty 170.
- **Week:** Monday first, as `weekOf`. The scope defaults to this project, and the choice is remembered.
- **Empty this week:** "Nothing finished this week yet." with "‹ Last week: 4 done · 8h 47m".
- **No history at all:** "Nothing finished yet. Finished tasks show here with their time and difficulty."

### 4.11 Usage & time

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ [Home|Tasks|History|*Usage & time*]         ≋ Working · 5h 62% · 19:40   [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │   Usage & time · Gait-feedback                                     ‹  26 Oct – 1 Nov  ›   │
│▍≋ Gait-feedback     6 │                                                                                           │
│▍  Detected · Working  │   ┌─ 5-hour allowance ─────────┐  ┌─ Today ───────────────┐  ┌─ This week ──────────────┐ │
│                       │   │ 62% used                   │  │ 2h 18m                │  │ 2h 18m                   │ │
│ ● queue-tie           │   │ ▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱       │  │ 19m in tasks          │  │ last week 5h 54m         │ │
│   ▶ Rename project fr…│   │ resets 19:40               │  │ 1h 58m outside tasks  │  │ 0 done · 1 in progress   │ │
│                       │   │ from Claude Code, 17:48    │  │                       │  │                          │ │
│                       │   └────────────────────────────┘  └───────────────────────┘  └──────────────────────────┘ │
│                       │                                                                                           │
│                       │     ░░░░░                                                                                 │
│                       │     ░░░░░                                                                                 │
│                       │     ░░░░░                                                                                 │
│                       │     █████                                                                                 │
│                       │     Mon 26     Tue 27     Wed 28     Thu 29     Fri 30     Sat 31     Sun 1               │
│                       │     2h 18m     —          —          —          —          —          —                   │
│                       │                                                                                           │
│                       │   Current task · Finish Insole Bridge to test the music orb and muffling · 43m            │
│                       │     Messages   0 understanding · 4 improving                                              │
│                       │     Files      33 read · 39 changed by Claude                                             │
│                       │     Lines      +812 −95 since 1649ade, uncommitted work included °   measured 17:48       │
│                       │                                                                                           │
│                       │   Time this week by task                                                                  │
│                       │     Finish Insole Bridge to test the music orb and muffling    19m      ██                │
│                       │     Outside tasks                                              1h 58m   ████████████      │
│                       │                                                                                           │
│                       │   A fresh conversation starts past 100,000 tokens; a handoff note is written at 90% used. │
│                       │                                                                                           │
│ ◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Tiles:** 112 px tall, 16 px gaps.
- **Allowance meter:** 20 segments; turns `--attention` at 90% or more.
- **No session:** "5-hour allowance: not reported yet", or "62% at 15:10, last seen".
- **No current task:** that block is left out.

### 4.12 Settings

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ Settings                                                                 [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │   Queue-tea in Claude Code                                    change these with /config   │
│ ≋ Gait-feedback     6 │   Idle gap that stops the clock              15 minutes                                   │
│   Detected · Working  │   Fresh conversation at                      100,000 tokens                               │
│                       │   Handoff note at                            90% of the 5-hour allowance                  │
│ ● queue-tie           │   Message check time limit                   10 seconds                                   │
│   ▶ Rename project fr…│   Read from Claude Code. Change them with /config there.             [ Copy /config ⧉ ]   │
│                       │                                                                                           │
│                       │   Open Claude Code in                                                                     │
│                       │   ( ) Terminal     (•) iTerm2     ( ) VS Code                                             │
│                       │   Start runs claude in the project there when no session is open in it.                   │
│                       │                                                                                           │
│                       │   This realm · Gait-feedback                                                              │
│                       │   Record           Gait-feedback-232ca6.json · last good copy        [ Show in Finder ]   │
│                       │   Task log         docs/task_log.md                                         [ Change… ]   │
│                       │   GitHub account   @first-account                                           [ Change… ]   │
│                       │                                                                                           │
│                       │   GitHub accounts                               kept by gh; the app holds no tokens       │
│                       │   first-account                                                                           │
│                       │   second-account                                         your terminal's account          │
│                       │   [ Add account… ]                                                                        │
│                       │                                                                                           │
│                       │   Opening the app on a project                                                            │
│                       │   queue-tea open   in a project's terminal                         [ Install command… ]   │
│                       │   queue-tea://open?path=…   used by the tea cup's menu in Claude Code                     │
│                       │                                                                                           │
│                       │   Keyboard                                                                                │
│                       │   [✓] Single-key shortcuts in lists: s start · d done · b back to queue · 1–5 priority    │
│                       │                                                                                           │
│ ◇ Tea Room            │                                                                                           │
│▍⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Layout:** a 420 px label column; 28 px rows; 24 px between sections.
- **One realm at a time.** The realm section shows only the realm you're in, so another project's record or log is never on this page.
- **The four /config values** are read-only. With no session they show the defaults, marked "default".
- **The records are real:** on 26 Oct Gait-feedback had no `.bak` and queue-tie had one; since 27 Oct both records have one.

### 4.13 Guild Hall, formerly the Tea Room

The hall shows the four helpers, and each one takes orders. Which of them Claude uses on a quest is still turned on per quest: in the new-task sheet and in the detail panel of a queued quest and of the task in progress.

In the Jade Peaks mockups each helper is a party member: its logo in an 88 px gold ring, its role as a chip in its colour, then what it does, its skills and its @-mention to copy. The built card adds a state chip beside the role (Ready, At work, Done, Stuck, Stopped), a speech bubble under the header and the order box above the @-mention. The drawing below is from before orders. Since 6 Nov each helper is drawn as a little bot instead of its logo: a white egg-shaped shell that glows in its colour, an antenna, two eyes, arms and legs, and a prop after its pun (Commit Chai-n swings a chain, Mocha Mockup holds up a mockup, Chai-pter reads a book, Tea-DD shakes a test flask). It stands on top of its card rather than inside a ring. In Branches, a merge with conflicts shows the same four bots on a bench; one dragged onto the merge, or pressed, resolves it with Tea-concile, one at a time.

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ Tea Room                                                                 [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │     ) ( )      Tea Room                                                                   │
│ ≋ Gait-feedback     6 │   ▄▀▀▀▀▀▀▀▄    Queue-tea keeps the queue. These four brew alongside it in Claude Code:    │
│   Detected · Working  │  ▐▀ ▄•ω•▄ ▀)   ask for one by name, or @-mention it in your message.                      │
│                       │                                                                                           │
│ ● queue-tie           │   ┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐ │
│   ▶ Rename project fr…│   │ ╭──────╮  Commit Chai-n                │   │ ╭──────╮  Mocha Mockup                 │ │
│                       │   │ │ ◉══◉ │  Git · cyan                   │   │ │ ◠══◠ │  Design · green               │ │
│                       │   │ ╰──────╯                               │   │ ╰──────╯                               │ │
│                       │   │ Branch names, the state of a branch,   │   │ The design stage, before code: options │ │
│                       │   │ commits split and worded, pull         │   │ and trade-offs, screens and states,    │ │
│                       │   │ requests drafted, pushes planned. It   │   │ keys and flows, data shapes and the    │ │
│                       │   │ hands you every commit, push, merge.   │   │ acceptance criteria.                   │ │
│                       │   │ Skills  git-workflow-and-versioning    │   │ Skills  spec-driven-development +3     │ │
│                       │   │ @queue-tea:commit-chai-n ⧉             │   │ @queue-tea:mocha-mockup ⧉              │ │
│                       │   └────────────────────────────────────────┘   └────────────────────────────────────────┘ │
│                       │                                                                                           │
│                       │   ┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐ │
│                       │   │ ╭──────╮  Chai-pter                    │   │ ╭──────╮  Tea-DD                       │ │
│                       │   │ │ ◡══◡ │  Docs · amber                 │   │ │ ◉══◉ │  Tests · violet               │ │
│                       │   │ ╰──────╯                               │   │ ╰──────╯                               │ │
│                       │   │ Writes and updates a project's docs    │   │ Tests for every feature and fix, in    │ │
│                       │   │ and keeps them true to the code, in    │   │ the project's own style; for a bug,    │ │
│                       │   │ plain writing that reads as a person   │   │ the failing test first. It runs the    │ │
│                       │   │ wrote it.                              │   │ suite and reports the counts.          │ │
│                       │   │ Skills  documentation-and-adrs         │   │ Skills  test-driven-development +1     │ │
│                       │   │ @queue-tea:chai-pter ⧉                 │   │ @queue-tea:tea-dd ⧉                    │ │
│                       │   └────────────────────────────────────────┘   └────────────────────────────────────────┘ │
│                       │                                                                                           │
│▍◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Grid:** cards 440×236 px in 2×2 with 24 px gaps; one column below 900 px. The ╭╮ box stands for the 72 px dark logo tile.
- **Hover:** the tile lifts 2 px with a 24%-alpha glow in the bot's colour; the cup winks (400 ms).
- **Content** is bundled at build time from the `agents/*.md` frontmatter and `.claude-plugin/helpers/*.svg`.
- **Orders:** each card has an "Order for <helper>" box and Send. The order goes to Claude Code, run in the background as that helper, in the realm picked in the sidebar, or in the worktree of the quest under way. The header says which realm. With no realm picked, the header asks for one and the cards have no order box. An empty order shows "Order is required." under the box, and one over 4,000 characters "Keep the order under 4,000 characters."; a refusal from the app shows there too.
- **The helper at work:** a speech bubble under the portrait says what the helper is doing now ("Reading timer.ts…", "Editing README.md…"), how many steps so far and in which folder, and Send becomes Stop. When it is done the bubble holds its answer. When it gets stuck it says why in plain words, with Try again, which sends the same order to the same realm again; a stopped helper says "Stopped. Nothing after that step was done." and offers Try again too. An idle helper's bubble has a line of its own ("Which chapter needs writing?"). While the first read is on its way each bubble says "Checking on the helpers…"; if that read fails, the failed state with Try again sits above the cards.
- **Motion:** an idle helper floats, blinks and sways its antenna, each a beat apart, and waves when the pointer is on it. At work it bobs, works its prop and steam rises; done, it hops once and wears a ✓; stuck, it shakes once and wears a !; stopped, it shakes once. A bench bot squashes as it is picked up. With reduced motion or Calm mode none of it moves, and the badges stay.
- **One order at a time per helper.** The four can work at once. Main keeps each helper's latest order while the app runs, so a restart forgets the answers, and an update waits until no helper is at work.

### 4.14 First run with no projects

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │                                                                                       [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │                                                                                           │
│ No projects yet       │                                                                                           │
│ Open folder…  ⌘O      │                                                                                           │
│                       │                                                                                           │
│                       │                                                                                           │
│                       │                                        ) ( )                                              │
│                       │                                    ▄▀▀▀▀▀▀▀▄                                              │
│                       │                                   ▐▀ ▄-ω-▄ ▀)                                             │
│                       │                                                                                           │
│                       │                               Welcome to Queue-tea                                        │
│                       │                                                                                           │
│                       │            One task in progress per project, the rest in a ranked queue, each             │
│                       │            on its own branch. You commit and push; Queue-tea never does.                  │
│                       │                                                                                           │
│                       │                                 [[ Open folder… ]]                                        │
│                       │                                                                                           │
│                       │                Or, in a project's terminal:   queue-tea open ⧉                            │
│                       │                Projects you use Queue-tea with in Claude Code show up here                │
│                       │                by themselves, from ~/.queue-tea/projects.                                 │
│                       │                                                                                           │
│ ◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Layout:** a centred 520 px column; the cup illustration at 120 px, idle face; a 32 px primary button. The ASCII cup stands in for `icon.png`.
- **Open folder… on a folder with no record:** "Gait-feedback isn't in Queue-tea yet." with [[ Add project ]]. The note says the record goes in `~/.queue-tea/projects` and nothing is written in the folder. Adding writes `emptyRecord`.
- **A folder that isn't a git repository** gets the spec's line about branches.

### 4.15 The failed record

```
┌───────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ ● ● ●             [⊟] │ (Home|Tasks|History|Usage & time)              ● Open · 5h 62% · 19:40   [⌕ Search ]  [+] │
├───────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│                       │                                                                                           │
│ Projects            + │   queue-tie                                                                               │
│ ≋ Gait-feedback     6 │   ~/Documents/projects/personal_projects/queue-tie                                        │
│   Detected · Working  │                                                                                           │
│                       │   ┌──────────────────────────────────────────────────────────────────────────────┐        │
│▍● ⚠ queue-tie         │   │ ⚠ Couldn't read your task record                                             │        │
│▍  Couldn't read       │   │ It isn't valid JSON (Unexpected token '}' at position 1832).                 │        │
│                       │   │                                                                              │        │
│                       │   │ It is left as it is. Use the last good copy, try again, or look at           │        │
│                       │   │ the file in ~/.queue-tea/projects.                                           │        │
│                       │   │ ~/.queue-tea/projects/queue-tie-c2159f.json ⧉                                │        │
│                       │   │                                                                              │        │
│                       │   │ [[ Use the last good copy ]]  [ Try again ]  [ Show in Finder ]        l · r │        │
│                       │   └──────────────────────────────────────────────────────────────────────────────┘        │
│                       │                                                                                           │
│                       │   Nothing can start or change in queue-tie until its record reads.                        │
│                       │   Other projects work as usual.                                                           │
│                       │                                                                                           │
│                       │   Written by a newer Queue-tea:                                                           │
│                       │   It was written by a newer Queue-tea (record version 2); update Queue-tea to read it.    │
│                       │   [ Try again ]  [ Show in Finder ]   (no copy: an older one would lose the newer work)   │
│                       │                                                                                           │
│                       │   Not a record:  It isn't a Queue-tea record.                                             │
│                       │   No last good copy (Gait-feedback has none today):  [ Try again ]  [ Show in Finder ]    │
│                       │                                                                                           │
│                       │   After Use the last good copy, a toast: Back to the last good copy. The broken record is │
│                       │   kept as queue-tie-c2159f.json.broken-2026-10-26-1750                                    │
│ ◇ Tea Room            │                                                                                           │
│ ⚙ Settings            │                                                                                           │
│                       │                                                                                           │
└───────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘
```

- The tabs are disabled while the record fails to read.
- The reasons come from `whyUnreadable`; the copy comes from `hooks/app/menu/menu_frame.tsx` and `hooks/app/session/session_rhythm.ts`.

### 4.16 States across screens

```
STATE · loading (after 150 ms; before that the pane stays blank)
   Gait-feedback

   ◐ Reading your queue…

STATE · empty project (queue-tie once its one task is done)
   queue-tie

                                        ) ( )
                                    ▄▀▀▀▀▀▀▀▄
                                   ▐▀ ▄^ω^▄ ▀)

                                  Nothing queued yet.
             Add what you're working on, and it waits here until you press Start.
                                  [[ + New task ]]  ⌘N

STATE · Claude Code sessions, as the Now card's session line and the toolbar pill
   ≋ Claude Code is working on it · a turn is running        pill  ≋ Working · 5h 62% · 19:40
   ● Claude Code is open here, waiting for you               pill  ● Open · 5h 62% · 19:40
   ? Is Fix the documentation done for now?                   pill  ? Needs you · 5h 62% · 19:40
   ≋ Claude Code is working in queue-tie, not here.           pill  ≋ In queue-tie ›
     [[ Open in Claude Code ]] opens a new one in iTerm2 here
   ○ No Claude Code session in Gait-feedback.                 pill  ○ No session
     [[ Open in Claude Code ]] starts one in iTerm2
   ○ No Claude Code session (last seen 17:41)                 a heartbeat older than 90 s
   ≋ 2 sessions here · one turn running                       pill  ≋ 2 sessions · 5h 62% · 19:40
   Allowance not reported yet: the pill leaves it out; Usage says 5-hour allowance: not reported yet
```

- **Failed:** see 4.15.
- **Working:** every multi-step action shows one ◌ line on its card or row, in the copy of 4.6, 4.8 and 4.9, and that row is locked while it runs.
- **Record changed by Claude Code:** the app watches the file and reloads it. Changed rows flash `--accent-wash` for 600 ms, and a field you are editing keeps its text.

### 4.17 Narrow window and the command palette

```
NARROW · 760 × 600: the sidebar folds away (⌃⌘S brings it back as an overlay), tabs become a menu
┌──────────────────────────────────────────────────────────────────────┐
│ ● ● ●  [⊟]  Gait-feedback ▾   [Tasks ▾]        ≋ 62%   [⌕]  [+]      │
├──────────────────────────────────────────────────────────────────────┤
│ ▶ In progress 1                                                      │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ ▶ Finish Insole Bridge to test the music orb and…   {! Urgent} │   │
│ │ ≋ Claude Code is working on it                                 │   │
│ │ [[ Open in Claude Code ]]  [ Done… ]  [ Back to queue ]  ⋯     │   │
│ └────────────────────────────────────────────────────────────────┘   │
│ ○ Backlog 6                                       Time I have: any ▾ │
│▍★ ▾ Fix the documentation                                 {! Urgent} │
│▍    ◆ 0/1 done ▱▱▱▱▱ · Hard · ~3h 46m · waited 4d                    │
│       Move homepage parts elsewhere; add privacy f…       {▮▮▮ High} │
│     Fix cut-off text in docs diagrams and add checks      {▮▮▮ High} │
│     Medium · ~1h 30m · waited 6d                                     │
│                                                                      │
│ Return opens the detail as its own page: ‹ Tasks  Fix the docu…      │
└──────────────────────────────────────────────────────────────────────┘

COMMAND PALETTE (⌘K, 600 px, 80 px below the toolbar): empty, then typing
┌────────────────────────────────────────────────────────┐  ┌────────────────────────────────────────────────────────┐
│ ⌕ Type a command, a task or a project                  │  │ ⌕ fix                                                  │
├────────────────────────────────────────────────────────┤  ├────────────────────────────────────────────────────────┤
│ Suggested                                              │  │ Tasks in Gait-feedback                                 │
│ ▍Open in Claude Code                                ⌘↩ │  │ ▍◆ Fix the documentation · Backlog · Urgent          ↩ │
│   Done… Finish Insole Bridge…                        d │  │   Fix cut-off text in docs diagrams… · Backlog · High  │
│   New task                                          ⌘N │  │   Fix privacy, battery alert, hist… · Backlog · High   │
│ Go to                                                  │  │ Actions                                                │
│   Home ⌘1 · Tasks ⌘2 · Designs ⌘3 · Branches ⌘4        │  │   Back to queue: Finish Insole Bridge…               b │
│   History ⌘5 · Usage & time ⌘6                         │  │                                                        │
│ Projects                                               │  │ Create                                                 │
│   queue-tie                                        ⌥⌘2 │  │   + New task "fix"                                  ⌘N │
├────────────────────────────────────────────────────────┤  ├────────────────────────────────────────────────────────┤
│ ↩ run · ↑↓ move · esc close                            │  │ ↩ open · ⌘↩ start · ↑↓ move · esc close                │
└────────────────────────────────────────────────────────┘  └────────────────────────────────────────────────────────┘
```

### 4.18 Hoard and badges

```
HOARD & BADGES (an app-wide page, from the sidebar)
┌─ Your hoard ───────────────────────────────┐  ┌─ Your dragon · Level 2 · 120 XP ───────────────────────┐
│            ▄▄▄  (a pile of gold coins)     │  │ [Egg ✓]  [Hatchling]  [Young]  [Adult]  [Elder]        │
│          ▄▄▄▄▄▄▄                           │  │  Lv 1     Lv 2–4       Lv 5     Lv 10    Lv 20         │
│        ▄▄▄▄▄▄▄▄▄▄▄                         │  │           you are here 1,000    4,500    19,000 XP     │
│ 120  gold from 5 victories                 │  │                                                        │
│                                            │  │ To level 3                         20 / 200 XP         │
│ queue-tea · 4 victories          95 gold   │  │ ▰▱▱▱▱▱▱▱▱▱                                             │
│ ▰▰▰▰▰▰▰▰▱▱                                 │  │                                                        │
│ Gait-feedback · 1 victory        25 gold   │  │ Light 10 XP, Medium 25, Hard 50, by how hard           │
│ ▰▰▱▱▱▱▱▱▱▱                                 │  │ it really was. Each level needs 100 XP more            │
│ Nothing to spend it on yet.                │  │ than the last.                                         │
└────────────────────────────────────────────┘  └────────────────────────────────────────────────────────┘
┌─ Badges · 2 of 7 earned ───────────────────────────────────────────────────────────────────────────────┐
│ (◆) First Flame · 20 Oct    (◆) Night Owl · 27 Oct, 03:30    ( ) Ten Tales  5 of 10                    │
│ ( ) Dragon Slayer  1 of 5   ( ) Saga’s End  0 of 1           ( ) Early Bird                            │
│ ( ) Week of Fire  best 3 of 7                                                                          │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Layout:** the hoard and the dragon side by side, each at least 380 px, with the badges below; one column in a narrow window.
- **Gold by realm** lists every record, so a realm with no victories shows 0 gold.
- **Badges:** earned ones glow gold with the date; locked ones are outlined, with a progress bar where there's something to count.
- **Before the first victory:** "No gold yet. Your first victory starts the hoard." The egg is marked "you are here".

### 4.19 Codex in place of Claude Code

Added 2026-11-03, phase 1 of Multiple tasks. Claude Code keeps the primary button everywhere, and Codex gets a secondary one beside it. These wireframes use the game's words, as the screens do.

```
NO ACTIVE QUEST (Home), with Claude's allowance used up
┌──────────────────────────────────────────────────────────────────────────────┐
│ No active quest                                                              │
│ Next up: Fix the documentation                                               │
│ ★ urgent                                                                     │
│ Claude Code is open · waiting for you                                        │
│ ! Claude's 5-hour allowance is used up until 16:40°. Codex can carry on.     │
│ [[ Start ★ Fix the documentation ]]  [ Start in Codex ]                      │
└──────────────────────────────────────────────────────────────────────────────┘

ACTIVE QUEST WITH CODEX (Home's Now card; the Active quest card in Quests)
┌──────────────────────────────────────────────────────────────────────────────┐
│ {Active quest}  In progress · 1h 12m° so far · started 3 Nov 09:14°          │
│ Fix the documentation                                                        │
│ task/fix-documentation · Hard                                                │
│ {+50 XP} {+50 gold} · 4° improving messages · 12° files changed              │
│ With Codex since 3 Nov 14:05°. Queue-tea can't watch Codex at work: finish   │
│ the quest here when it's done.                                               │
│ [[ Show Codex ]] [ Finish quest… ] [ Back to the board ] [ Seal… ]           │
│ [ Continue in Claude Code ] [ Open Codex again ]                             │
└──────────────────────────────────────────────────────────────────────────────┘

ACTIVE QUEST WITH CLAUDE CODE: the same card, its last lines
│ Claude Code is working on it · a turn is running                             │
│ ! Claude's 5-hour allowance is used up until 16:40°. Codex can carry on.     │
│ [[ Open in Claude Code ]] [ Finish quest… ] [ Back to the board ] [ Seal… ]  │
│ [ Continue in Codex ]                                                        │
```

- **Start in Codex** sits beside Start on Home's card when no quest is active, and in a quest's detail pane. It is disabled whenever Start is, and absent on a sealed quest. It runs the Start flow of 4.6 (the same git hold and ◌ lines), then toasts "Set out with Codex: <title> · <branch>". It has no letter key: s starts on Claude Code.
- **The hint** shows while Claude's allowance is at 100% and its reset is still ahead; with no reset time it reads "Claude's 5-hour allowance is used up. Codex can carry on." It sits above Start on Home, in the detail pane while no quest is active, and on the active quest's card while Claude Code has it. It never moves Codex to the first button or starts anything.
- **With Codex,** the "With Codex since…" line takes the session line's place, because Queue-tea can't watch Codex at work. Show Codex only brings the terminal forward. Open Codex again opens a new Codex with the brief, for when its window was closed.
- **Continue in Codex** shows "◌ Moving it to Codex… it opens with the quest and its last note", then the toast "Codex has <title> now". While Claude Code's turn runs it is refused: an error toast says why, with [ Try again ], and nothing changes.
- **Continue in Claude Code** shows "◌ Bringing it back to Claude Code…", then the toast "Claude Code has <title> again. Close Codex's window so only one works on it."
- **VS Code** as the terminal: the folder opens, the Codex line is copied, and the toast says "The Codex line is copied: paste it in VS Code's terminal".
- **Codex's time not read:** after Finish, Back to the board, Seal or Continue in Claude Code, an error toast says "Couldn't read Codex's log, so this quest's time on Codex wasn't added." The action itself has gone through.

### 4.20 Designs

Added 2026-11-05. The approved screens are in `docs/design-tab.pen`, and [design-tab.md](design-tab.md) has the file format, every state and the keys.

- **Where:** a tab between Quests and Branches, at `/designs`, opened with ⌘3.
- **The version page:** a History rail of the realm's design versions, newest first, beside the chosen version's designs as cards. **Next version…** sits in the header. Until you pick a version, the page shows the newest one that reads.
- **The editor:** the canvas in the middle, with the inspector and the design's comments on the right. It saves 600 ms after the last change.
- **Below 900 px:** the rail becomes a "Version 1 of 5, newest" menu, and the inspector and comments float over the canvas.

---

## 5. Components

```
COMPONENT STATES · task row (44 px; 60 px with the ★ line)
   default      Fix cut-off text in docs diagrams and add checks                {▮▮▮ High}
                Medium · ~1h 30m · waited 6d
   hover        Fix cut-off text in docs diagrams and add checks   [Start] ⋯    {▮▮▮ High}
   selected   ▍ Fix cut-off text in docs diagrams and add checks                {▮▮▮ High}
   ★            ★ Fix the documentation  + a line: ★ urgent
   play next    ↥ Refocus 'who uses it' diagram…  + a line: ★ you chose Play next
   starting     Fix cut-off text in docs diagrams…                ◌ Checking git…
   saved        Fix cut-off text in docs diagrams…                            {! Urgent ✓}
   not saved    Fix cut-off text in docs diagrams…   Couldn't save. [Try again] {▮▮▮ High !}
   blocked      Analyse new recordings: false steps and backgro…   (72% opacity) {▮▮▯ Mid}
                ⊘ waiting for the clinic's new recordings
   dragging     lifted 2 px, shadow-2; a feature row under it gets a tea wash, or the refusal:
                Fix the documentation has tasks of its own, so it can't be part of another.
   match        Fix cut-off text in docs «diagrams» and add checks

COMPONENT STATES · priority control, progress, toasts
   {▮▮▮ High ▾}    ┌───────────────┐     ▱▱▱▱▱ 0/1 done
                   │ 1 ! Urgent    │     ▰▰▱▱▱ 2/5 done · 1 in progress · 1 blocked
                   │ 2 ▮▮▮ High  ✓ │     ▰▰▰▰▰ 3/3 done   (green once complete)
                   │ 3 ▮▮▯ Mid     │
                   │ 4 ▮▯▯ Okay    │     ✓ Queued: Rebuild the iPhone apps (mid) · part of Finish Insole…
                   │ 5 ▯▯▯ Low     │     Priority: high → urgent · Fix cut-off text…            [ Undo ]
                   └───────────────┘     ⚠ Couldn't save the task. Try Save again.            [ Retry ]
```

| Component | Size and parts | States |
|---|---|---|
| Task row | 44/60 px; selection bar, ★ slot, fold slot, title (Body 500, one line, …), meta (Callout, text-2), priority control | default, hover (shows Start and ⋯), selected, focused (ring), ★ with why, Play next, feature, child, blocked (72%), starting (locked, ◌), saved ✓, not saved (reverts), dragging, drop target, search match, Start disabled with its reason |
| Feature group | its own row with ▸/▾ and the "◆ 2/5 done ▰▰▱▱▱ · 1 in progress · 1 blocked" line; children 20 px in; a 28 px "+ Add child task" row | folded (with the ★ child line if the ★ is inside), unfolded, active feature tag, the feature in progress (▶; children ○/⊘/▶/✓), all done (green bar), drop target, refusal |
| Priority control | 24 px pill: glyph, word, ▾; popover of five 28 px items with keys 1–5 | default, hover, focus, open, saved ✓ (1.2 s), failed (! and revert), read-only (History, done) |
| State chip | 20 px, Caption: ○ Backlog, ▶ In progress, ? Review, ⊘ Blocked, ✓ Done; markers ★ Suggested, ↥ Play next, ◆ Feature, Detected | static; Review and Done tinted |
| Progress bar | 5 segments, each 10×6 px with 2 px gaps (as `progressText`), plus the text | 0/n, partial, an in-progress segment hatched tea, blocked count, complete (green) |
| Session badge | toolbar pill (28 px: 16 px mood cup, word, allowance) and the sidebar mark (8 px) | Working (steam), Open, Needs you, Elsewhere ›, None, Stale, several sessions, allowance unknown |
| Party portrait | the helper drawn as a bot, 120 px, standing on its card and glowing in its colour; 56 px on the Branches bench | default, hover (waves), focus; idle, at work, done, stuck, stopped (4.13) |
| Toast | bottom centre, 40 px, radius 10, shadow-2; glyph, text, optional action | info, success, warning, error; 4 s, or 6 s with an action; up to 3 stacked; hover pauses; announced politely (errors assertively) |
| Dialog / sheet | sheets 600 px, confirmations 480 px; 15/20 title; buttons right-aligned | default, invalid (primary disabled plus an amber hint), busy ("◌ Finishing…"), error (inline, stays open), destructive (red primary) |
| Empty state | cup 96–120 px with its mood face, a 15/20 title, one line, one action | no projects, no tasks, nothing this week, nothing blocked (header only), no search match |
| Command palette | 600 px; 44 px input; 36 px rows with shortcuts; sections | empty (Suggested), typing, no match (+ New task "…"), running (◌), an entry that can't run (dim, with its reason) |
| Also | Now card, hold card, checkpoint card, sticky section header, segmented control, copyable command (Mono, ⧉ → "Copied" 1.2 s), week chart (stacked, hover tip), allowance meter | as drawn above |
| HUD chip | 42 px pill: the level badge with its XP bar; the streak; gold; the mana bar | default; the XP bar fills over 1.2 s after a victory; mana turns `--attention` at 90% used |
| Sky dial | five 32 px round buttons (Follow my clock, Morning, Day, Evening, Night) and a note | on, hover, focus; it and the Sky setting are one value |
| Dragon | 270 px on Home, 86 px in the Hoard | asleep, awake, working, needs you, cheering, petted; still under Reduce Motion or Calm mode |
| Reward chip | 22 px pill: +XP in jade, +gold in gold, a badge in lacquer | static |
| Badge | a 46 px medal, its name, one line, a progress bar | earned (gold, with the date), locked (outlined, with progress) |
| Victory panel | 460 px over a dimmed sky, with coins bursting behind it | plain, with a level-up, with a new badge |

---

## 6. Data

### What each screen reads from existing data

| Screen | Reads |
|---|---|
| Sidebar | a `readOthers`-style scan of `~/.queue-tea/projects` (`project.name/path`, counts by `state` and `isBlocked`, `suggest()` for ★, `currentTask()`); `parseRecord` / `whyUnreadable` for ⚠; the session files |
| Home | `currentTask`; `cardNote` / `latestNote`; `effort`, `minutesByDay`, `branch`, `started`; `activeFeature`; `progressOf` / `progressText`; the top 3 of `rankBacklog(record, budget)` through `groupBacklog`; `blockedTasks` count; `doneThisWeek`, `finishedTasks`, `weekMinutes`, `weekOf`; `readGit` + `holdReason`; `readDrift` / `checkLines`; the session |
| Tasks | `rankBacklog` (with `why`, `estimate`, `isShort`, `fits`), `groupBacklog`, `blockedTasks`, `blockedText`, `progressOf`, `childrenOf` / `parentOf`, `activeFeature`, `BUDGETS` / `nextBudget` / `budgetLabel`, `formatSpan`, `formatAge`, `canWaitFor`, `parentChoices`, `parentRefusal`, `record.playNext`, `record.feature` |
| Task detail | every `Task` field; `checkpointSections`, `handoffSections`, `cardNote`; `slugBranch(title, listBranches())`; `readFacts` (branch, head, uncommitted); `diffSince(startCommit)` |
| New task | `filingCandidates`, `loneTasks`, `parentRefusal`, `newTask` (default `mid`), `estimateMinutes` |
| Start | `readGit`, `holdReason`, `parseStatusPaths`, `slugBranch`, `makeBranch` / `switchBranch`; the claim in the record (`startTaskUseCase`); sessions |
| Done | `difficulty.expected`, `docsLogPath`, `diffSince`, `addRow` / `writeDocsLog`, `finishOnce` |
| History | `finishedTasks`, `weekOf`, `weekMinutes`, `unassignedMinutesByDay`, both difficulties, `effort.linesAdded/linesRemoved/filesTouched`, from every record for All projects |
| Usage & time | `formatAllowance` on the session's allowance, `weekMinutes`, `unassignedMinutesByDay`, the current task's `effort`, a live `diffSince` |
| Settings | `Options` from the session file; `docsLogPath` per record; whether `<record>.bak` exists; the app's own settings |
| Guild Hall | `agents/*.md` frontmatter (name, description, colour, skills) and `.claude-plugin/helpers/*.svg`, bundled at build time; each helper's latest order from main (`readHelpers`, then `onHelpers` as it changes), not the record |
| HUD and Hoard | `finishedTasks` from every record (`difficulty.actual`, `finished`, `parentId`) and `childrenOf`, through the rules in 2.2 |
| Designs | not the record: `docs/designs/` in the realm's folder (`version.json`, `comments.json`, `*.design.json`), `git config user.name` for comment authors and `git status` for uncommitted files; Next version files its quest with `fileQuest` |

### New fields

The record stays at version 1. New fields get defaults in `withDefaults` / `parseRecord`, and unknown fields survive a read-modify-write.

| Field | Default | Why |
|---|---|---|
| `Task.description: string \| null` | `null` | a feature's own description; every task gets one, since any task becomes a feature once it has children |
| `Task.criteria: string[]` | `[]` | completion criteria, shown in the detail pane and in Review |
| `Task.review: { at: string; checked: string \| null } \| null` | `null` | set by `task_looks_done`, cleared by Yes / Not yet, so the app shows Review without the session's `$.state` |
| `ProjectRecord.requests: { id; kind: 'begin' \| 'putBack'; taskId; at }[]` | `[]` | what the app asks an open session to do; the mod removes one when it's handled (from the plan) |
| `Task.codexSince: string \| null` | `null` | when the quest went to Codex; null while Claude Code has it (added 2026-11-03, 4.19) |

The game layer adds no fields: XP, levels, the stage, the streak, gold and badges are worked out from the fields above each time.

### New files outside the record

- **The session file** `~/.queue-tea/sessions/<id>.json` holds `{ id, projectPath, recordFile, currentTaskId, isTurnRunning, cup: { mood, line }, allowance, options, heartbeat, startedAt }`. That's the plan's list plus two fields:
  - `options`, so Settings shows the real /config values;
  - `cup.mood`, so the pill can mirror "needs you".
- **Designs** live in the realm, at `docs/designs/<version folder>/`, in the format in [design-tab.md](design-tab.md). The last good copy of each file is kept at `~/.queue-tea/designs/<realm key>/`.
- **App settings** (Electron `userData`): terminal (`terminal | iterm2 | vscode`), sky (`auto | morning | day | evening | night`), Calm mode on or off, pane widths, folded features per project, single-letter keys on or off, window bounds.

**Not saved anywhere:** the git hold, Time I have, the selection and the search. They are view state per project.

---

## 7. Acceptance criteria

1. At 1280×800 the panes measure 248 / at least 420 / 360 px.
   - At 1179 px or less, the detail pane floats over the list.
   - Below 900 px, the sidebar hides and the detail opens as a page with ‹ Back.
   - The window can't go below 720×560.
2. Every text pair in the tokens is at least 4.5:1 (UI marks at least 3:1).
   - Every control shows its focus ring.
   - With Reduce Motion on, or Calm mode, nothing moves: no leaves, lanterns, mist, aurora, glider, dragon loop or coin burst.
3. No button anywhere reads Commit, Push, Merge or Pull. This can be checked with a DOM test; git commands appear only as copy-only text.
4. Switching the sky between morning, day, evening and night changes colours and scenery only. A screenshot diff of the panels shows no layout change.
5. With the records as of 27 Oct, the sidebar shows exactly Gait-feedback and queue-tea. The `.brew-repro-tmp-*` dot-file is hidden.
6. Opening through `queue-tea open` or `queue-tea://open?path=` selects that project and tags it Detected.
7. A session file with a heartbeat up to 90 s old marks its project ≋ or ●. Older files count as no session. The pill follows 4.16.
8. Switching projects keeps each one's tab, selection, folds, scroll and Time I have.
9. The Backlog order equals `groupBacklog(rankBacklog(record, budget), …)`. The ★ row's line is `why`, character for character.
10. A feature's children sit directly under it. ▸/▾ and ←/→ fold them. A folded feature holding the ★ shows "★ <child> · <why>".
11. Changing priority with the chip or keys 1–5:
    - the chip updates in the same frame;
    - the record is written within 300 ms;
    - ✓ shows for 1.2 s;
    - if the write fails, the chip reverts and says so;
    - ⌘Z restores the old priority.
12. Filing, inline or in the sheet, never starts a task. "+ Add child task" sets `parentId`. With an active feature, the sheet won't add until something is picked.
13. A move asks first. A move that `parentRefusal` refuses shows its sentence and changes nothing.
14. Search filters by title and branch within 50 ms for 500 tasks. Filters combine. No match shows the empty state with Clear.
15. Start with uncommitted files or unpushed commits writes nothing and makes no branch, and the hold text equals `holdReason()`.
    - Check again runs the check again.
    - When it passes, `task/<slug>`, or the put-back task's own branch, is checked out and the task is current.
16. With a session open, Start adds a `begin` request. With none, it opens the chosen terminal running `claude` in the project. Each step shows its ◌ line.
17. Done defaults to the expected difficulty.
    - With `docsLogPath` null, it asks for the path, prefilled `docs/task_log.md`.
    - Afterwards the record has `state: done`, the actual difficulty, `finished` and the lines, and the task log has its row.
18. When the mod sets `review`, the Review card appears within 2 s with its "Claude checked" line. Yes opens Done. Not yet clears `review`.
19. Back to queue:
    - with a session, it shows "Saving a checkpoint…" until the mod has put the task back;
    - with none, it puts the task back at once, keeps branch, start commit, time and priority, and says Claude's checkpoint wasn't written.
20. Blocked… lists only `canWaitFor` tasks. A reason sets `blockedReason`. Used on the current task, it puts the task back blocked.
21. An unreadable record shows the reason from `whyUnreadable`.
    - Use the last good copy appears only when `<record>.bak` reads, and never for a newer version.
    - Nothing in that project can change until it reads; other projects keep working.
22. With no records, the first-run screen shows Open folder… and the `queue-tea open` hint.
23. Records the app writes still read in the mod (`parseRecord`) and keep unknown fields. The mod's test count is unchanged after `npm install` in `app/`.
24. Every Task-menu action has a key.
    - Single letters type normally inside text fields.
    - ⌘K opens within 100 ms, and Return runs the highlighted entry.
25. Every text pair is at least 4.5:1 at each of the four times of day, measured on its panel laid over the darkest sky that can sit behind it.
26. With Sky on "Follow my clock", 05:00–09:59 is morning, 10:00–16:59 day, 17:00–19:59 evening, and 20:00–04:59 night. A fixed choice is kept in the app's settings, and the sky dial and Settings always agree.
27. Every game number comes from pure functions over the records, and no game field is written to a record. With the records as of 27 Oct they give 120 XP, level 2, a Hatchling, 120 gold, a 1-day streak (best 3), and First Flame and Night Owl.
28. The game never blocks or delays work. Done writes the record before any victory animation; the victory panel and badge toasts close with Esc; every work action stays one click or key away while they show.

---

## 8. Decisions

Each was an open question with a suggested answer. Rohan took every suggested answer on 2026-10-27.

1. **Board now or later?** Later, with parallel tasks. This release ships the List only.
2. **Home for one project or all?** One project, with Other projects at the bottom. The sidebar carries the status across projects.
3. **Single-letter keys in the app?** Yes, the terminal's letters, off inside text fields, with a switch in Settings.
4. **Description and criteria on every task, or features only?** Every task, collapsed when empty.
5. **Should criteria be tickable?** Not yet: a plain list. Perhaps ticks during Review later.
6. **Notify on Review when the app is in the background?** Yes: a macOS notification, "Claude says Fix the documentation looks done", whose click opens Review. No buttons on the notification.
7. **Where do the /config values come from?** From the session file's `options`. With no session, show the defaults marked "default".
8. **VS Code as the terminal?** Open the folder with `code` and copy `claude`, with the toast "Paste it in VS Code's terminal". Checked on 2026-10-27 against the Claude Code extension 2.1.311: its URL `vscode://anthropic.claude-code/open?prompt=…` opens the graphical Claude panel, not a terminal, and its `claude-vscode.terminal.open` command can only be run from inside VS Code.
9. **Should the UI name the terminal app?** Only if the mod can write `terminal` (from `TERM_PROGRAM`) into the session file; otherwise don't name it.
10. **Remove: confirm or undo?** An Undo toast for a task; a dialog for a feature, because its children change.
11. **Filing while a feature is active: keep the spec's "nothing picked"?** Yes. "+ Add child task" is the quick way to file under a feature.
12. **Sidebar order?** By last activity at launch, then stable for the session.
13. **History's default scope?** This project. All projects is one click away and remembered.
14. **Show the unbuilt sections?** No: no sidebar items and no placeholders until they exist.
15. **A menu-bar tea cup?** Later; not in this release.
16. **Is "Time I have" saved?** No. It's per project, in memory, and resets on quit, like the terminal's per-session value.

Added on 2026-10-28, with the look:

17. **Which look?** Jade Peaks, over Tea House and the Pixel Realm, Candy Kingdom and Sky Realm directions.
18. **How much game?** The full layer in 2.2, worked out from the record, with no shop for gold yet.
19. **What's the night?** A lantern night: dark blue-green, a jade aurora and rising lanterns, on the dark panel tokens.
20. **Does the sky follow the clock?** Yes, by default, and Settings or the sky dial can fix it.
21. **When do Early Bird and Night Owl count?** 05:00–08:59 and 22:00–03:59, so a finish at 03:30 counts as Night Owl.

Added on 2026-11-03, with Codex (4.19):

22. **Which button leads when Claude's allowance is used up?** Claude Code, still. The hint says Codex can carry on, and Rohan picks.
23. **Can Claude Code and Codex work on one quest at once?** No. Continue in Codex is refused while Claude's turn runs, and Show Codex never opens a second Codex.
