# Meetings

Spec and record for the **Meetings, agendas and follow-up notes** quest (t-cfa806e9). Its done line: a meeting note with attendees, agenda, link (Meet, Zoom, Teams), decisions and action items; no calendar account needed.

## What the user can do

A note typed **Meeting** is a meeting note. Its template has four sections: **Agenda**, **Notes**, **Decisions** and **Action items** (a checklist). Under the title, a **Meeting details** card shows when the meeting is on the Mac's clock, a **Join** button for its call, who comes, and a count of agenda items, decisions and open action items.

**Add meeting details…** (or **Edit details…** once there are some) opens a sheet with the meeting's day, start and end times, time zone, call link and attendees. Every field is optional. **Join on Zoom**, **Join on Google Meet**, **Join on Teams** or **Join the call** opens the link in the browser.

**Follow-up meeting** makes the next meeting note: the same folder, attendees and call link, no time yet, a `[[link]]` back to this note, and this note's open action items on its agenda. Ticked items stay behind.

A meeting note with a time also shows on the realm's **Calendar**, at its hour on the Mac's clock, marked as a meeting. Clicking it opens the note in Notes. No calendar account is needed: the meeting lives in the note.

## Decisions

These are the defaults this quest picked; each can change in a word.

- **A meeting is a note, not a calendar event.** The note is the record, so its time, call and people live in the note's front matter, and the Calendar reads them from there. Nothing is written to `Calendar.json`, and Export notes takes meetings along with the notes.
- **The agenda, decisions and action items are Markdown sections** under their headings, so they stay plain text that Obsidian shows as it is. The card counts them; nothing else reads them. Headings are matched without case, and `Decision`, `Actions` and `Next steps` count too.
- **Action items are a checklist**, so Notes' **Turn into quests** files them as quests the way it does for any note.
- **A meeting keeps its own zone's clock**, as a calendar event does: wall times plus an IANA zone. A call at 15:00 in Lisbon shows at 09:00 on a Mac in Chicago, with "15:00 – 15:30 in Europe/Lisbon" beside it.
- **The sheet edits one day.** The end comes after the start on the same day. A meeting written elsewhere may cross midnight (up to 24 hours) and still reads.
- **Picking a day fills 09:00 to 09:30** when no times are set yet. Clearing the day takes the time off.
- **A link pasted without `https://`**, as invites often show it, is taken as a web address. The call is named from the host: `meet.google.com` is Google Meet; `zoom.us`, `zoom.com` and `zoomgov.com` and their subdomains are Zoom; `teams.microsoft.com` and `teams.live.com` are Teams. Any other web link is a plain call link.
- **An attendee is one line**: a name, an email, or both, such as `Ana Lima <ana@example.com>`. Commas separate them too. Repeats are dropped without regard to case.
- **Changing a note's type away from Meeting keeps its details** in the file, hidden, so changing it back brings them back.
- **A follow-up is named "<title> follow-up"**, numbered when that is taken. A follow-up of a follow-up keeps one suffix.
- **Meetings on the calendar open their note.** They can't be moved or removed from the Calendar; that is done in the note.

## The note file

A meeting's details are five front matter keys, each written only when set, after `tags`:

```yaml
---
title: "Weekly sync"
folder: "Meetings"
type: "meeting"
tags: []
attendees: ["Ana Lima <ana@example.com>","Sam"]
meeting-link: "https://zoom.us/j/123456789"
meeting-start: "2026-12-01T15:00"
meeting-end: "2026-12-01T15:30"
meeting-zone: "Europe/Lisbon"
created: "2026-11-25T10:00:00-06:00"
updated: "2026-11-25T10:00:00-06:00"
archived: false
quests: []
aliases: ["Weekly sync"]
---
```

- Queue-tea writes them as JSON, which YAML reads too, so Obsidian shows each as a property. It reads the plain YAML Obsidian writes as well: a list of attendees under `attendees:`, or one line with commas, and unquoted times.
- A note with none of the keys has no meeting details. Files written before this quest read and write as they did.
- A value that doesn't read, such as a link that isn't a web address or a zone this Mac doesn't know, is kept in the file as it was, and the card shows that part as not set. Saving a new value writes over it. The three time keys read together: if one is wrong, none is used.
- A save from the window always carries the meeting. A save that leaves it out (an older window) keeps the file's.

## Screens

- **The card, nothing set:** "No time, call link or attendees yet.", the counts, and **Add meeting details…**.
- **The card, with details:** the day and times on the Mac's clock, the meeting's own zone's times beside them when that is another zone, **Join…** when there is a link, the attendees ("No attendees yet" when none), the counts, **Edit details…** and **Follow-up meeting**. With no time it reads "No time set".
- **An archived meeting note** shows its card without the buttons, and leaves the Calendar.
- **The card is in Write and Read**, not in Graph.
- **The sheet:** Day, then Starts, Ends and Time zone once there is a day, then Call link and Attendees, each with a hint line. **Cancel** changes nothing. **Save details** saves with the note, and the note's save line says how that went, as for its text.
- **Calendar, while the notes are read:** the events and due dates show at once, with "Still reading meeting notes…" and the spinner under the header. The meetings join when the read ends.
- **Calendar, when the notes can't be read:** "Couldn't read this realm's meeting notes, so they're left off the calendar." with **Try again**. The events and due dates stay.
- **Calendar items:** a meeting chip has a coloured edge and opens its note. The Agenda adds "Meeting" or "Meeting · Zoom" after it.

## Fields and their checks

The sheet checks each field when it loses focus and all of them on **Save details**. Main checks them again before it saves.

| Field | Check | Message |
| --- | --- | --- |
| Day | Empty for no time, or a real day | "Enter a day such as 2026-12-01." |
| Starts *, Ends * | With a day: HH:MM, the end after the start | "Start time is required.", "End time is required.", "Enter a time such as 14:30.", "The end has to come after the start." |
| Time zone * | With a day: a zone the Mac knows; the list offers them all | "Time zone is required.", "Pick a time zone from the list, such as America/Chicago." |
| Call link | Empty, or an `http` or `https` address with a host, 2,048 characters at most | "Enter the call's link as a web address, such as https://zoom.us/j/123456789." |
| Attendees | 50 different names at most, each 100 characters at most; anything with text on both sides of an `@` must be a valid email | "A meeting can have 50 attendees at most.", "An attendee's name can be 100 characters at most.", "Enter a valid email address." |

Main refuses a meeting that doesn't pass with its own sentence (`badMeetingLink`, `badMeetingTime`, `meetingAttendeeLong`, `meetingTooManyAttendees` in `app/main/core/messages.ts`) and writes nothing.

## Architecture

| Part | Where |
| --- | --- |
| The meeting type, limits, front matter keys, and the checks both sides share | `app/shared/meetings.ts` |
| `meeting` on a note, its input and its change | `app/shared/notes.ts` |
| Reading and writing the keys, keeping what doesn't read | `app/main/features/notes/domain/note_file.ts` |
| Checking a meeting before a save | `meetingOf` in `app/main/features/notes/api/notes_api.ts` |
| Sections, follow-ups, the sheet's form and checks | `app/renderer/features/notes/domain/meeting_notes.ts` |
| The card and the sheet | `app/renderer/features/notes/presentation/widgets/meeting_card.tsx`, `meeting_sheet.tsx`, `meeting.css` |
| Where the card sits and what its buttons do | `app/renderer/features/notes/presentation/widgets/note_workspace.tsx`, `pages/notes_page.tsx` |
| Meetings as calendar items | `meetingItemsOf` in `app/renderer/features/calendar/domain/calendar_items.ts`, shown by `calendar_item.tsx` and `agenda_view.tsx`, read in `pages/calendar_page.tsx` |
| Opening a meeting's note from the Calendar | `onOpenNote` in `app/renderer/app/app.tsx` |

Text the user reads is in `app/renderer/l10n/en.ts` under `meeting`, and the Meeting template under `notebook.templates`. The limits are `MEETING_LIMITS`.

## Acceptance checks

1. A Meeting note starts with Agenda, Notes, Decisions and Action items, and its card counts them.
2. The sheet saves a day, times and zone, a Meet, Zoom, Teams or other link, and attendees, checking each field on blur and all on Save; main refuses what the sheet would.
3. **Join** opens the call in the browser and names Meet, Zoom or Teams from the link.
4. The details are written as front matter Obsidian shows as properties, read back after a restart, and an Obsidian-written note reads too; values that don't read are kept.
5. **Follow-up meeting** makes the next note with the same folder, attendees and link, no time, a link back, and the open action items on its agenda.
6. A meeting note with a time shows on the Calendar at its hour on the Mac's clock, and opens its note; no calendar account is involved.

## Testing

Tea-DD's **Deep** profile: the quest adds a stored field that old notes must still read, and it spans two features (Notes and the Calendar). Tea-DD and Mocha Mockup aren't runnable as agents in the session that built this, so their definitions were followed by hand. No `.pen` design was drawn; the card and sheet reuse the Notes and Calendar styles.

- `app/main/features/notes/domain/meeting_file.spec.ts`: the file format, Obsidian's YAML, kept values, links, call kinds, times and attendees.
- `app/main/features/notes/api/meeting_notes_api.spec.ts`: saving, clearing, keeping the file's meeting, restoring a version, and main's refusals.
- `app/renderer/features/notes/domain/meeting_notes.spec.ts`: sections, follow-ups, times on the Mac's clock, and the sheet's checks.
- `app/renderer/app/meeting_notes.spec.tsx`: the card, the sheet, Join and Follow-up meeting in the app.
- `app/renderer/features/calendar/domain/calendar_items.spec.ts` and `presentation/pages/calendar_page.spec.tsx`: meetings on the calendar, the notes' loading and failed lines, and opening a note from the Calendar.

## Not in this quest

Making a meeting note from a calendar event, repeating meetings and reminders (t-d4cec95d), importing and exporting `.ics` (t-b4038d01), and Google Calendar (t-f42cae61). Attendees are text: nothing is sent to them.
