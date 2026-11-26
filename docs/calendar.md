# Calendar

Spec and record for the **Realm calendar and due dates** quest (t-5e764412). Its done line: Month, Week and Agenda views; all-day and timed events; time zones right; quest due dates link to quests.

## What the user can do

Open **Calendar** (after Notes, ⌘8) and see the selected realm's events and the due dates of its quests. **Month** shows the weeks of a month, **Week** shows seven days hour by hour with all-day items above, and **Agenda** lists four weeks day by day. **New event…**, or a day's number, opens a sheet for an all-day or timed event with a title, its days, its times, its time zone, a place and notes. Clicking an event opens the same sheet to change it, with **Remove event…** at its foot.

A quest gets a due date in its details pane, under **Due date**, in the quest pane and the active quest pane alike. The quest then shows on that day of the calendar. Clicking it opens the quest on the Quests tab. A quest whose day has passed shows as **Overdue**, and the Agenda lists those first when its four weeks include today.

## Decisions

These are the defaults this quest picked; each can change in a word.

- **One Calendar tab per realm**, after Notes, at `/calendar`, opened with ⌘8. The View menu and the palette's Go to list it. Its events belong to the selected realm only.
- **Events live with the realm's notes**, in `Calendar.json` in the realm's notes folder, so Export notes takes them along and Restore brings them back. The file is JSON. Import… and Export… read and write `.ics` files, added later by t-b4038d01: see [Calendar import and export](calendar-ics.md).
- **A timed event keeps its own zone's clock.** It is saved as the wall times it was given plus an IANA zone name, such as `Europe/Lisbon`, and every view shows it on the Mac's clock. A call at 15:00 in Lisbon shows at 09:00 on a Mac in Chicago, and still at 15:00 Lisbon time after either side changes to or from summer time. The sheet edits an event on its own zone's clock, and a line under the time zone says which zone the Mac is on.
- **An all-day event has no zone.** It is a first and a last day, both included, and shows on those days wherever the Mac is.
- **A due date is a plain day**, as `due: "YYYY-MM-DD"` on the quest in the record, with no time and no zone. Records without it read as before.
- **Due dates show for quests still in play**: on the board, sealed, or active. A finished quest leaves the calendar, though its record keeps the day.
- **The due date is set in the quest's details**, not in the New quest sheet. The field saves when it loses focus or on Return, so a year typed digit by digit is never saved half-way. **Clear due date** takes it off.
- **Weeks start on Monday and times use a 24-hour clock**, as elsewhere in the app. Days read "3 Dec".

## The calendar file

`~/.queue-tea/notes/<realm key>/Calendar.json`:

```json
{
  "format": 1,
  "events": [
    { "id": "e-1a2b3c4d", "title": "Lisbon trip", "when": { "kind": "allDay", "startDay": "2026-12-03", "endDay": "2026-12-05" }, "place": null, "notes": null },
    { "id": "e-5e6f7a8b", "title": "Call with Ana", "when": { "kind": "timed", "start": "2026-11-26T15:00", "end": "2026-11-26T15:30", "zone": "Europe/Lisbon" }, "place": "Zoom", "notes": null }
  ]
}
```

- No file means no events. The first save makes it.
- Events are kept in order of when they start.
- A save writes a `.tmp` file, keeps the last good copy as `Calendar.json.bak`, then moves the new file into place. Export notes skips both.
- An imported event also carries `source`, and the file is then format 2 ([details](calendar-ics.md#the-calendar-file)).
- An entry that doesn't read, or repeats an id, is left in the file as it is, after the others, and the page says how many there are.
- A file that isn't a calendar, or a newer format, is refused and never written over; the page says which file and why.
- A time that falls in a summer-time gap moves forward to the first time that exists. A time that happens twice takes the first.

## Screens

- **Loading:** "Reading this realm's calendar…" with the spinner.
- **Failed:** the reason and **Try again**.
- **Empty:** "Nothing on the calendar yet", with a line saying events and due dates show here, and **New event…**.
- **Month:** a grid of weeks with weekday names. Today is marked. A day shows up to three items. A busier day shows its first two and "+N more", which opens the Agenda at that day. A timed event shows its start time on its first day.
- **Week:** a header of days, a row for all-day events and due dates, then the hours, opened at 08:00, with a line at the time now. Events that overlap share the column side by side.
- **Agenda:** only the days that hold something. Each line says when, the item, and the place. When an event's zone isn't the Mac's, the line also gives its time on its own zone's clock.
- Under the header: previous and next (a month, a week, or four weeks), **Today**, the range, and a line naming the Mac's zone.

## Fields and their checks

The sheet checks each field when it loses focus and all of them on **Add event** or **Save event**. Main checks them again before it saves.

| Field | Check | Message |
| --- | --- | --- |
| Title * | Required, 200 characters at most; new lines become spaces | "Title is required." |
| Starts *, Ends * | A real day; the end not before the start | "Enter a day such as 2026-12-01.", "The end has to come after the start." |
| Start time *, End time * | HH:MM, for a timed event; the end after the start, as moments | "Enter a time such as 14:30.", "The end has to come after the start." |
| Time zone * | A zone the Mac knows; the list offers them all | "Pick a time zone from the list, such as America/Chicago." |
| Length | Under a year | "An event can last a year at most. Split a longer one into parts." |
| Place, Notes | 200 and 5,000 characters at most | "Place must be 200 characters or fewer.", "Notes must be 5,000 characters or fewer." |
| Due date | A real day, or empty to clear | "Pick a due date from the calendar, or clear it." |

A refusal from main shows in a banner at the top of the sheet, and the sheet stays open.

## Architecture

| Part | Where |
| --- | --- |
| The event and file types, limits, `isDay` | `app/shared/calendar.ts` |
| Wall times, zones and moments | `app/shared/calendar_time.ts` |
| Reading, checking and writing the file | `app/main/features/calendar/domain/calendar_file.ts` |
| The engine calls, one change at a time | `app/main/features/calendar/api/calendar_api.ts`, channels in `app/shared/engine_api.ts`, bridged in `app/preload/preload.ts` |
| Reading and writing `.ics` files, and where an imported event came from | See [Calendar import and export](calendar-ics.md#architecture) |
| Days, weeks, months and ranges | `app/renderer/features/calendar/domain/calendar_days.ts` |
| Events and due dates as items on days, and lanes in the week | `app/renderer/features/calendar/domain/calendar_items.ts` |
| The sheet's form and its checks | `app/renderer/features/calendar/domain/event_form.ts` |
| The page and its views | `app/renderer/features/calendar/presentation/` |
| The due date field | `app/renderer/features/quests/presentation/widgets/due_control.tsx` |
| The due date in the record | `due` in `types/index.d.ts`; read in `hooks/shared/records/data/datasources/record_source.ts`, set and cleared in `hooks/features/tasks/domain/usecases/edit_task.ts`, and checked by main in `app/main/features/tasks/domain/task_input.ts` |

Text the user reads is in `app/renderer/l10n/en.ts` under `calendar` and `detail`, and main's messages in `app/main/core/messages.ts`. The route `/calendar` is in `app/renderer/config/routing/routes.ts`. The tab and ⌘8 are in `app/renderer/app/app.tsx`, the View menu in `app/main/core/app_menu.ts` and the palette's Go to in `app/renderer/features/palette/domain/palette.ts`. The values are `CALENDAR_HOUR_PX` (44), `CALENDAR_OPEN_HOUR` (8), `CALENDAR_MONTH_ITEMS` (3) and `CALENDAR_CLOCK_MS` (60,000) in `app/renderer/core/constants/constants.ts`, and the file's limits in `CALENDAR_LIMITS`.

## Acceptance checks

1. Calendar sits after Notes at `/calendar` and opens with ⌘8; the View menu and the palette list it.
2. Month, Week and Agenda show the realm's events and due dates, and page back, forward and to today.
3. An all-day event shows on each of its days; a timed one at its hour on the Mac's clock.
4. An event made in another zone keeps that zone's clock and shows at the right moment here, through summer-time changes.
5. Adding, changing and removing an event saves to `Calendar.json` and survives a restart; a hand-edited or newer file is never written over.
6. A due date set in a quest's details shows on its day, opens the quest when clicked, and shows as overdue once its day has passed. Clearing it takes it off.

## Not in this quest

Each is its own quest: importing and exporting `.ics` (t-b4038d01, added later, see [Calendar import and export](calendar-ics.md)), syncing with Google Calendar (t-f42cae61), meetings (t-cfa806e9, added later: Meeting notes with a time show on the calendar and open their note, see [Meetings](meetings.md)), and reminders and repeating events (t-d4cec95d).
