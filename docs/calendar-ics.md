# Calendar import and export with ICS

Spec and record for the **Calendar import and export with ICS** quest (t-b4038d01). Its done line: import and export events with time zones; imported events show where they came from.

Test profile: **Deep**, because it adds engine calls and a stored field (`source`) that older calendar files must still read. Tea-DD was followed by hand from `agents/tea-dd.md`, as the helpers can't run as subagents in the cloud.

## What the user can do

The Calendar page's header has **Import…** and **Export…** beside **New event…**.

- **Import…** opens the Mac's file dialog for an `.ics` file, exported from Google Calendar, Apple Calendar, Outlook or any app that writes RFC 5545. A sheet then says what the file holds before anything changes: the calendar's name and the app, how many events are new, how many would update events imported before, and how many are here already, with each event's name and time. Events that can't come in are named with the reason. **Import N events** adds the new ones and updates the changed ones in one save.
- **Export…** writes the realm's events to an `.ics` file where Rohan chooses, named after the realm. Calendar apps import it with each event at the right moment.
- **An imported event says where it came from.** Its chip has a dotted left edge, its tooltip says "From Work" and VoiceOver reads "Edit Design review, imported from Work"; the Agenda adds "From Work" under it; its sheet opens with "Imported on 26 Nov 2026 from Work.ics, the Work calendar in Google Calendar." and a line that importing the file again replaces changes made here.

## Decisions

These are the defaults this quest picked; each can change in a word.

- **Only the realm's own events go out.** Due dates and Meeting notes stay with their quests and notes, so an export holds what the import can bring back.
- **Nothing changes until the sheet's button.** The preview is read in main, checked against the calendar, and shown first. Cancelling a dialog changes nothing.
- **An event is matched by its UID.** One imported before keeps its id and takes the file's version; one the same as the file is left alone. An export names each event `<id>@queue-tea`, so importing Queue-tea's own export changes nothing, and an imported event keeps the UID it came with, so the app it came from knows it again.
- **Importing again wins over edits made here.** The sheet's hint and the event's own line say so. Editing an imported event keeps where it came from, so the next import still finds it.
- **Time zones are kept by name.** An event keeps its file's zone when Queue-tea knows it: an IANA name (`Europe/Lisbon`), one at the end of a path (`/mozilla.org/…/Europe/Berlin`), the zone a VTIMEZONE names in `X-LIC-LOCATION`, or a Windows name the way Outlook writes it (`Central Standard Time` is `America/Chicago`, from CLDR's table). A zone known only by its VTIMEZONE's offsets is read through them, and the event goes on the calendar's zone, else the Mac's. Times in UTC, and floating times with no zone, go on the calendar's `X-WR-TIMEZONE` when it has one, else the Mac's zone, as Google's export expects.
- **What can't come in is named, not dropped quietly:** repeating events and their moved weeks (`RRULE`, `RDATE`, `RECURRENCE-ID`) until repeating events have their own quest; cancelled events; no start; a timed event with no end or length; a time that doesn't read; over a year long; a zone Queue-tea can't place; and a second copy of one event, where the later `SEQUENCE`, else the last, comes in.
- **Long text is cut, not refused.** A title over 200 characters, a place over 200 and notes over 5,000 end in "…". An event with no title is "Untitled event". An event with no UID gets a stand-in made from its start and title, so the same file read twice matches.
- **Limits:** a file over 20 MB is refused by name, and an import that would take the calendar past 5,000 events is refused at the preview and again at the import.
- **The export defines every zone it uses** in a VTIMEZONE with one part per change of offset in the events' years, worked out from the Mac's own zone data, so it needs no rules. UTC gets one too, so a UTC event comes back in UTC. All-day events are dates, with `DTEND` the day after the last, as RFC 5545 has it. Lines are folded at 75 bytes with CRLF.

## The calendar file

An imported event carries `source` in `Calendar.json`:

```json
{
  "format": 2,
  "events": [
    {
      "id": "e-5e6f7a8b",
      "title": "Design review",
      "when": { "kind": "timed", "start": "2026-11-30T14:00", "end": "2026-11-30T15:00", "zone": "Europe/Lisbon" },
      "place": "Room 2",
      "notes": null,
      "source": { "file": "Work.ics", "calendar": "Work", "app": "Google Calendar", "uid": "review@google.com", "importedAt": "2026-11-26T10:00:00.000Z" }
    }
  ]
}
```

- `file` and `uid` are needed; `calendar` (from `X-WR-CALNAME`) and `app` (from `PRODID`) may be `null`. A `source` that doesn't read leaves the entry in the file as it is, like any entry that doesn't read.
- The file says format 2 only while an event has a source, so an older Queue-tea refuses it as newer instead of saving the sources away. A calendar with no imported events stays format 1. Both read.

## Screens

- **Working:** the two buttons are disabled and a line says "Reading the calendar file…" or "Exporting the calendar…" with the spinner.
- **Failed:** a dialog with the reason, **Close** and **Try again**. A file that isn't a calendar, or is too big, is named.
- **Import sheet:** "Import from Work.ics"; the calendar and app; the counts; up to 100 events by name with New, Updates or Already here; what can't come in and why; and **Import N events**. When nothing is new it says so and offers only **Close**. A refused import stays open with the reason in a banner.
- **Done:** a toast, "Imported 3 new events and updated 1." or "Exported 12 events to Demo.ics.". **Export…** on an empty calendar says "Nothing to export yet. Add an event first." without opening the dialog.

## Architecture

| Part | Where |
| --- | --- |
| The source, preview, import and export types, `ICS_LIMITS`, `SOURCE_LIMITS` | `app/shared/calendar.ts` |
| Content lines, folding and escaping | `app/main/features/calendar/domain/ics_text.ts` |
| TZID names, the Windows table and reading a VTIMEZONE's rules | `app/main/features/calendar/domain/ics_zones.ts` |
| An `.ics` file to events and skips | `app/main/features/calendar/domain/ics_import.ts` |
| Events to an `.ics` file, with VTIMEZONEs | `app/main/features/calendar/domain/ics_export.ts` |
| Matching by UID and joining an import; `source` in the file | `app/main/features/calendar/domain/calendar_file.ts` |
| `readCalendarImport`, `importCalendarEvents`, `exportCalendar` | `app/main/features/calendar/api/calendar_api.ts`; the dialogs are injected from `app/main/main.ts`; channels in `app/shared/engine_api.ts`, bridged in `app/preload/preload.ts` |
| The buttons, the import sheet and the failure dialog | `app/renderer/features/calendar/presentation/widgets/calendar_files.tsx` |
| Where an event came from, on its chip, in the Agenda and in its sheet | `calendar_item.tsx`, `agenda_view.tsx` and `event_sheet.tsx` beside it |

Text is in `app/renderer/l10n/en.ts` under `calendar.files`, `calendar.fromTag`, `calendar.editImported`, `calendar.sourceLine` and `calendar.sourceHint`, and main's messages in `app/main/core/messages.ts`. `CALENDAR_IMPORT_ROWS` (100) is in `app/renderer/core/constants/constants.ts`.

## Acceptance checks

1. Import… reads an `.ics` from Google, Apple or Outlook and shows what it would add, update and leave, and what can't come in and why, before anything changes.
2. Imported events keep their zones: an IANA zone, a Windows zone, a path, or a VTIMEZONE alone; UTC and floating times land on the calendar's zone.
3. Each imported event shows where it came from: chip, Agenda and sheet.
4. Importing the same file again updates in place and adds no copies; importing Queue-tea's own export changes nothing.
5. Export… writes an `.ics` with every zone defined, all-day days, escaping and folding, that reads back as the same events.
6. A calendar with imported events is format 2; one without stays format 1; an older Queue-tea leaves a format 2 file alone.

## Not in this quest

Syncing with Google Calendar (t-f42cae61), and repeating events and reminders (t-d4cec95d), which is also when `RRULE` events can come in.
