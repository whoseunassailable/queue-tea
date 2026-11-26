# Using Notes

Select a realm, then open **Notes** or press `⌘7`. Each realm has its own
notes. You can capture an unfinished thought and come back to organize it or
turn it into work on the quest board.

## From a rough idea to a saga

1. In **Jot an idea**, enter `Maybe we should understand the missed steps`.
   Press Return to capture it in Inbox and keep typing ideas. Press
   `⌘Return` to capture it and open its editor.
2. Give the idea some context in **Write**, then add the work as open
   checklist lines:

   ```markdown
   Find out why short walks lose steps.

   - [ ] Reproduce a missed step
   - [ ] Compare sensor recordings
   ```

3. Press **Turn into quests…** in BrewQuest's card beneath the editor.
   BrewQuest proposes a parent named after the note and a quest for each
   open checklist line. Nothing is filed yet.
4. Review the proposal. Rename the parent to `Understand missed steps`,
   clarify each quest's title, and choose its priority and difficulty.
   Clear a checkbox to leave that row out. With this example, keep the
   parent and both children, then press **File 3 quests**.
5. In **About this note**, the **Quests** section shows the filed saga and
   its children. Press a quest to open it on the board. Filing puts work in
   the selected realm's queue; it does not start that work.

BrewQuest uses checklist lines rather than interpreting vague prose. With no
open checklist lines, an unfiled note becomes one quest using its title and
first paragraph. One open line becomes one quest without a parent. Two or
more lines propose a saga. Checked lines are left out. Defaults are **Mid**
priority and **Medium** difficulty.

If filing stops part way, the rows already filed lock. **Try again** files
the rest. Adding a checklist line later proposes another quest under the
note's existing parent while that parent is still open. Queue-tea remembers
the original checklist text: changing that text makes it a new item, even
if it looks much like one you filed earlier.

BrewQuest's robot shows what it's doing: it waves when you point at it,
thinks while the note saves, works while it files, cheers when the quests
are in, looks puzzled after a drag that lands nowhere, and shows red when
something fails. Under Reduce Motion or Calm mode it keeps each look but
holds still.

## Find a note in a large realm

Press `⌘F` inside Notes to focus **Search notes**. Search ignores case and
requires every word to match somewhere in the title, body or tags. For
example, `missed recordings` can match one word in the title and the other
in the body. A term beginning with `#` searches tag prefixes only:
`#res missed` finds matching notes tagged `research`. Inline hashtags in
the body do not set a note's tags.

Search covers all notes in the current view before paging. **Notes** searches
live notes, **Archived** searches archived notes, and **Journal** searches
daily notes. **Clear search**, or Escape in a nonempty search field, clears
the query.

The list shows up to 100 notes per page. Use **Previous notes** and **Next
notes** below the folders to browse. Folder counts include every match in
that folder, including later pages. A folder heading repeats when its notes
continue on another page. Pinned notes appear first, then Inbox, then the
other folders alphabetically; each group puts the newest edit first.
Folding a folder, changing views or searching returns to the first page.

Changing page keeps your editor open and focuses the first note on the new
page. Use Up and Down to move between its rows, and Enter to open one.
Left folds the focused note's folder; use its heading to reopen it. In a narrow window,
press **Notes** above the editor to open the list drawer. Picking a note or
pressing Escape closes the drawer.

Notes reads at most 5,000 Markdown note files per realm, including archived
notes. Keep the vault within that limit; files beyond it can remain on disk
without appearing in the app. Archiving does not free a place under the limit.

## Organize and connect

Use **Folder** in **About this note** to move a note. Folders have one level;
they organize the list without moving the Markdown file into a subfolder.
Use a folder's **Rename** button to rename it. **Tags** takes comma-separated
values, such as `research, step-detection`. **Pin note** puts the note in
**Pinned**; **Unpin note** returns it to its folder in the list.

A note with no text or type offers Idea, Feature, Bug, Meeting, Research, Decision and Daily
templates. A template sets the note's type and starting text. Type and folder
are separate fields.

Type `[[` in **Write** to pick another note or a quest. Up and Down choose an
option; Return or Tab inserts it. Escape closes the picker. Note links look
like `[[Sensor sampling rates]]`; quest links keep the quest's id so renaming
that quest does not break the link. Renaming a note in Queue-tea updates links
to its title in the realm's other notes.

**Read** renders the Markdown. Links open their targets, and ticking a
checklist box saves the change to the note. **Links** and **Backlinks** in
the inspector offer another way to move between related notes. **Graph**
shows those connections, either **Around this note** or across the **Whole
realm**. Use **Filter** to choose which types and quests appear, and **Fit**
to bring the graph into view.

**Canvas**, at the foot of the list, opens the realm's board. **Add note or
quest…** and **Add web link…** put cards on it, and dropping an image or PDF
on the board adds one too. Drag a card to move it and its corner to resize
it; with a card focused, the arrow keys move it and Option with the arrow keys
resizes it. **Connect**, then another card, draws a line between them; a
focused line goes with Delete. The board is `Canvas.canvas` in the notes
folder, so Obsidian opens it as a canvas.

**Today** opens today's note, creating it in Journal when needed. **Journal**
lists daily notes by month and lets you open another date with **Day** and
**Open day**. **Edit the daily template** opens the note that new days copy;
`{{date}}` and `{{title}}` become the new day's date and title.

## Save and recover

Notes autosaves after an 800 ms pause in editing. Wait for **Saved** before
quitting. If saving fails, your text stays in the editor and **Try again**
retries the save. Do not rely on unsaved text surviving an app restart.

If the file changes outside Queue-tea, saving stops and asks which version
to keep. **Keep mine** overwrites the file with your editor's version.
**Load the file's version** discards your unsaved edits. **Save as new note**
keeps your edits in a separate note so you can compare them.

**History** previews earlier saves. **Restore this version** brings back
that version's title, folder, tags and text, while keeping the replaced
version in History. Quest links and archive status stay as they are.
History keeps up to 100 versions: 50 recent saves, 24 older hourly versions
and 26 older daily versions.

**Archive note** makes a note read-only and moves it into **Archived**.
**Restore** makes it editable again. **Delete forever…** is offered only in
Archived and asks for confirmation. It removes the note and its saved
history. Attachments and filed quests remain.

At the foot of the list, **Export notes…** copies the realm's notes and files
into a new backup folder. History stays in Queue-tea. **Restore from backup…**
adds missing notes, leaves identical notes alone, and puts a differing backup
copy into the existing note's History. Check the result dialog for files
left out and the reason for each.

## Files and shortcuts

Notes live outside the realm's repository at
`~/.queue-tea/notes/<realm key>/`. Each note is a Markdown file with front
matter for its title, folder, tags and quest links. You can open the folder
as an Obsidian vault. Queue-tea reads note files at the top of that folder,
not inside subfolders. Return focus to Queue-tea to refresh outside edits.
For the full format and feature details, see [Notes](notes.md).

| Key | Action |
| --- | --- |
| `⌘7` | Open Notes for the selected realm |
| `⇧⌘N` | New note from any screen |
| `⌘J` | Focus Jot an idea while in Notes |
| `⌘F` | Focus search while in Notes |
| `⌘E` | Switch Write and Read; return to Write from Graph |
| `⌘G` | Open Graph for a live note |
| `⌘K` | Open the command palette, which can find notes or jot an idea |
| `⌘Return` | File the reviewed quests while the BrewQuest sheet is open |

The [performance design](superpowers/specs/2026-11-18-notes-performance-design.md)
records the list behavior and regression budgets. Its tests use 5,000 notes
with bodies, tags, pins and folders; they do not model every note holding the
maximum one million characters.
