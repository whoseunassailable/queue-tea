import { zoneNameOf } from '../../../../shared/calendar_time'
import type { IcsBlock } from './ics_text'
import { firstLine } from './ics_text'

// The time zone names Windows and Outlook write, and the IANA zone each
// stands for, from the Unicode CLDR's windowsZones table (its 001 rows).
export const WINDOWS_ZONES: Readonly<Record<string, string>> = {
  'Dateline Standard Time': 'Etc/GMT+12',
  'UTC-11': 'Etc/GMT+11',
  'Aleutian Standard Time': 'America/Adak',
  'Hawaiian Standard Time': 'Pacific/Honolulu',
  'Marquesas Standard Time': 'Pacific/Marquesas',
  'Alaskan Standard Time': 'America/Anchorage',
  'UTC-09': 'Etc/GMT+9',
  'Pacific Standard Time (Mexico)': 'America/Tijuana',
  'UTC-08': 'Etc/GMT+8',
  'Pacific Standard Time': 'America/Los_Angeles',
  'US Mountain Standard Time': 'America/Phoenix',
  'Mountain Standard Time (Mexico)': 'America/Mazatlan',
  'Mountain Standard Time': 'America/Denver',
  'Yukon Standard Time': 'America/Whitehorse',
  'Central America Standard Time': 'America/Guatemala',
  'Central Standard Time': 'America/Chicago',
  'Easter Island Standard Time': 'Pacific/Easter',
  'Central Standard Time (Mexico)': 'America/Mexico_City',
  'Canada Central Standard Time': 'America/Regina',
  'SA Pacific Standard Time': 'America/Bogota',
  'Eastern Standard Time (Mexico)': 'America/Cancun',
  'Eastern Standard Time': 'America/New_York',
  'Haiti Standard Time': 'America/Port-au-Prince',
  'Cuba Standard Time': 'America/Havana',
  'US Eastern Standard Time': 'America/Indianapolis',
  'Turks And Caicos Standard Time': 'America/Grand_Turk',
  'Paraguay Standard Time': 'America/Asuncion',
  'Atlantic Standard Time': 'America/Halifax',
  'Venezuela Standard Time': 'America/Caracas',
  'Central Brazilian Standard Time': 'America/Cuiaba',
  'SA Western Standard Time': 'America/La_Paz',
  'Pacific SA Standard Time': 'America/Santiago',
  'Newfoundland Standard Time': 'America/St_Johns',
  'Tocantins Standard Time': 'America/Araguaina',
  'E. South America Standard Time': 'America/Sao_Paulo',
  'SA Eastern Standard Time': 'America/Cayenne',
  'Argentina Standard Time': 'America/Buenos_Aires',
  'Greenland Standard Time': 'America/Godthab',
  'Montevideo Standard Time': 'America/Montevideo',
  'Magallanes Standard Time': 'America/Punta_Arenas',
  'Saint Pierre Standard Time': 'America/Miquelon',
  'Bahia Standard Time': 'America/Bahia',
  'UTC-02': 'Etc/GMT+2',
  'Azores Standard Time': 'Atlantic/Azores',
  'Cape Verde Standard Time': 'Atlantic/Cape_Verde',
  UTC: 'Etc/UTC',
  'GMT Standard Time': 'Europe/London',
  'Greenwich Standard Time': 'Atlantic/Reykjavik',
  'Sao Tome Standard Time': 'Africa/Sao_Tome',
  'Morocco Standard Time': 'Africa/Casablanca',
  'W. Europe Standard Time': 'Europe/Berlin',
  'Central Europe Standard Time': 'Europe/Budapest',
  'Romance Standard Time': 'Europe/Paris',
  'Central European Standard Time': 'Europe/Warsaw',
  'W. Central Africa Standard Time': 'Africa/Lagos',
  'Jordan Standard Time': 'Asia/Amman',
  'GTB Standard Time': 'Europe/Bucharest',
  'Middle East Standard Time': 'Asia/Beirut',
  'Egypt Standard Time': 'Africa/Cairo',
  'E. Europe Standard Time': 'Europe/Chisinau',
  'Syria Standard Time': 'Asia/Damascus',
  'West Bank Standard Time': 'Asia/Hebron',
  'South Africa Standard Time': 'Africa/Johannesburg',
  'FLE Standard Time': 'Europe/Kiev',
  'Israel Standard Time': 'Asia/Jerusalem',
  'South Sudan Standard Time': 'Africa/Juba',
  'Kaliningrad Standard Time': 'Europe/Kaliningrad',
  'Sudan Standard Time': 'Africa/Khartoum',
  'Libya Standard Time': 'Africa/Tripoli',
  'Namibia Standard Time': 'Africa/Windhoek',
  'Arabic Standard Time': 'Asia/Baghdad',
  'Turkey Standard Time': 'Europe/Istanbul',
  'Arab Standard Time': 'Asia/Riyadh',
  'Belarus Standard Time': 'Europe/Minsk',
  'Russian Standard Time': 'Europe/Moscow',
  'E. Africa Standard Time': 'Africa/Nairobi',
  'Volgograd Standard Time': 'Europe/Volgograd',
  'Iran Standard Time': 'Asia/Tehran',
  'Arabian Standard Time': 'Asia/Dubai',
  'Astrakhan Standard Time': 'Europe/Astrakhan',
  'Azerbaijan Standard Time': 'Asia/Baku',
  'Russia Time Zone 3': 'Europe/Samara',
  'Mauritius Standard Time': 'Indian/Mauritius',
  'Saratov Standard Time': 'Europe/Saratov',
  'Georgian Standard Time': 'Asia/Tbilisi',
  'Caucasus Standard Time': 'Asia/Yerevan',
  'Afghanistan Standard Time': 'Asia/Kabul',
  'West Asia Standard Time': 'Asia/Tashkent',
  'Ekaterinburg Standard Time': 'Asia/Yekaterinburg',
  'Pakistan Standard Time': 'Asia/Karachi',
  'Qyzylorda Standard Time': 'Asia/Qyzylorda',
  'India Standard Time': 'Asia/Calcutta',
  'Sri Lanka Standard Time': 'Asia/Colombo',
  'Nepal Standard Time': 'Asia/Katmandu',
  'Central Asia Standard Time': 'Asia/Bishkek',
  'Bangladesh Standard Time': 'Asia/Dhaka',
  'Omsk Standard Time': 'Asia/Omsk',
  'Myanmar Standard Time': 'Asia/Rangoon',
  'SE Asia Standard Time': 'Asia/Bangkok',
  'Altai Standard Time': 'Asia/Barnaul',
  'W. Mongolia Standard Time': 'Asia/Hovd',
  'North Asia Standard Time': 'Asia/Krasnoyarsk',
  'N. Central Asia Standard Time': 'Asia/Novosibirsk',
  'Tomsk Standard Time': 'Asia/Tomsk',
  'China Standard Time': 'Asia/Shanghai',
  'North Asia East Standard Time': 'Asia/Irkutsk',
  'Singapore Standard Time': 'Asia/Singapore',
  'W. Australia Standard Time': 'Australia/Perth',
  'Taipei Standard Time': 'Asia/Taipei',
  'Ulaanbaatar Standard Time': 'Asia/Ulaanbaatar',
  'Aus Central W. Standard Time': 'Australia/Eucla',
  'Transbaikal Standard Time': 'Asia/Chita',
  'Tokyo Standard Time': 'Asia/Tokyo',
  'North Korea Standard Time': 'Asia/Pyongyang',
  'Korea Standard Time': 'Asia/Seoul',
  'Yakutsk Standard Time': 'Asia/Yakutsk',
  'Cen. Australia Standard Time': 'Australia/Adelaide',
  'AUS Central Standard Time': 'Australia/Darwin',
  'E. Australia Standard Time': 'Australia/Brisbane',
  'AUS Eastern Standard Time': 'Australia/Sydney',
  'West Pacific Standard Time': 'Pacific/Port_Moresby',
  'Tasmania Standard Time': 'Australia/Hobart',
  'Vladivostok Standard Time': 'Asia/Vladivostok',
  'Lord Howe Standard Time': 'Australia/Lord_Howe',
  'Bougainville Standard Time': 'Pacific/Bougainville',
  'Russia Time Zone 10': 'Asia/Srednekolymsk',
  'Magadan Standard Time': 'Asia/Magadan',
  'Norfolk Standard Time': 'Pacific/Norfolk',
  'Sakhalin Standard Time': 'Asia/Sakhalin',
  'Central Pacific Standard Time': 'Pacific/Guadalcanal',
  'Russia Time Zone 11': 'Asia/Kamchatka',
  'New Zealand Standard Time': 'Pacific/Auckland',
  'UTC+12': 'Etc/GMT-12',
  'Fiji Standard Time': 'Pacific/Fiji',
  'Chatham Islands Standard Time': 'Pacific/Chatham',
  'UTC+13': 'Etc/GMT-13',
  'Tonga Standard Time': 'Pacific/Tongatapu',
  'Samoa Standard Time': 'Pacific/Apia',
  'Line Islands Standard Time': 'Pacific/Kiritimati',
}

const WINDOWS_BY_LOWER = new Map(Object.entries(WINDOWS_ZONES).map(([name, zone]) => [name.toLowerCase(), zone]))

// The IANA zone a TZID means, or null when Queue-tea can't tell:
// - an IANA name as it is (Europe/Lisbon), the way Google and Apple write it;
// - an IANA name at the end of a path (/mozilla.org/20050126_1/Europe/Berlin);
// - the zone the file's own VTIMEZONE names in X-LIC-LOCATION;
// - a Windows name (W. Europe Standard Time), the way Outlook writes it.
export const ianaOf = (tzid: string, timezones: ReadonlyMap<string, IcsBlock>): string | null => {
  const name = tzid.trim()
  const direct = zoneNameOf(name)
  if (direct !== null) return direct
  const parts = name.split('/').filter(part => part !== '')
  for (let from = 0; from < parts.length - 1; from += 1) {
    const tail = zoneNameOf(parts.slice(from).join('/'))
    if (tail !== null && tail.includes('/')) return tail
  }
  const location = timezones.get(name) === undefined ? undefined : firstLine(timezones.get(name)!, 'X-LIC-LOCATION')
  const named = location === undefined ? null : zoneNameOf(location.value.trim())
  if (named !== null) return named

  return WINDOWS_BY_LOWER.get(name.toLowerCase()) ?? null
}

// When a zone has no name Queue-tea knows, its VTIMEZONE still says how its
// clock relates to UTC. These read it: each STANDARD or DAYLIGHT part starts
// at a local time on the clock before it, then repeats each year by its rule.
type Observance = { start: number; from: number; to: number; rule: { month: number; week: number; weekday: number; until: number | null } | null; dates: number[] }
const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
const MINUTE = 60_000

const offsetOf = (value: string | undefined): number | null => {
  const match = /^([+-])(\d{2})(\d{2})(\d{2})?$/.exec((value ?? '').trim())
  if (match === null) return null
  const minutes = Number(match[2]) * 60 + Number(match[3])

  return match[1] === '-' ? -minutes : minutes
}

// A local date-time as if it were UTC, in ms: 20260308T020000 is 8 March, 2:00.
export const localMsOf = (value: string): number | null => {
  const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?Z?$/.exec(value.trim())
  if (match === null) return null
  const ms = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] ?? 0), Number(match[5] ?? 0), Number(match[6] ?? 0))

  return Number.isFinite(ms) ? ms : null
}

const ruleOf = (value: string | undefined): Observance['rule'] => {
  if (value === undefined) return null
  const parts = Object.fromEntries(value.split(';').map(part => part.split('=') as [string, string]).map(([k, v]) => [k.toUpperCase(), v ?? '']))
  const day = /^([+-]?\d)?(SU|MO|TU|WE|TH|FR|SA)$/.exec(parts.BYDAY ?? '')
  const month = Number(parts.BYMONTH)
  if (parts.FREQ !== 'YEARLY' || day === null || !(month >= 1 && month <= 12)) return null
  const until = parts.UNTIL === undefined ? null : localMsOf(parts.UNTIL)

  return { month, week: day[1] === undefined ? 1 : Number(day[1]), weekday: WEEKDAYS.indexOf(day[2]!), until }
}

const observancesOf = (zone: IcsBlock): Observance[] =>
  zone.blocks.flatMap(part => {
    if (part.name !== 'STANDARD' && part.name !== 'DAYLIGHT') return []
    const start = localMsOf(firstLine(part, 'DTSTART')?.value ?? '')
    const from = offsetOf(firstLine(part, 'TZOFFSETFROM')?.value)
    const to = offsetOf(firstLine(part, 'TZOFFSETTO')?.value)
    if (start === null || from === null || to === null) return []
    const dates = part.lines.filter(line => line.name === 'RDATE').flatMap(line => line.value.split(',').map(localMsOf).filter((ms): ms is number => ms !== null))

    return [{ start, from, to, rule: ruleOf(firstLine(part, 'RRULE')?.value), dates }]
  })

// The nth weekday of a month at a time of day, as local ms; week -1 is the last.
const nthWeekday = (year: number, rule: NonNullable<Observance['rule']>, timeOfDay: number): number => {
  if (rule.week < 0) {
    const last = new Date(Date.UTC(year, rule.month, 0))
    const back = (last.getUTCDay() - rule.weekday + 7) % 7

    return Date.UTC(year, rule.month - 1, last.getUTCDate() - back) + timeOfDay
  }
  const first = new Date(Date.UTC(year, rule.month - 1, 1))
  const ahead = (rule.weekday - first.getUTCDay() + 7) % 7

  return Date.UTC(year, rule.month - 1, 1 + ahead + (rule.week - 1) * 7) + timeOfDay
}

// Every change of offset near a year, as UTC moments, earliest first.
const changesAround = (observances: Observance[], year: number): { at: number; from: number; to: number }[] =>
  observances
    .flatMap(o => {
      const locals = [o.start, ...o.dates]
      if (o.rule !== null) {
        const timeOfDay = o.start % 86_400_000
        const firstYear = new Date(o.start).getUTCFullYear()
        for (let y = Math.max(firstYear, year - 1); y <= year + 1; y += 1) {
          const local = nthWeekday(y, o.rule, timeOfDay)
          if (local >= o.start && (o.rule.until === null || local - o.from * MINUTE <= o.rule.until)) locals.push(local)
        }
      }

      return locals.map(local => ({ at: local - o.from * MINUTE, from: o.from, to: o.to }))
    })
    .sort((a, b) => a.at - b.at)

// The UTC moment a local wall time names on a VTIMEZONE's clock, or null when
// the zone says nothing usable. A time skipped when the clocks go forward
// reads on the clock before the jump, as Queue-tea does elsewhere.
export const instantInBlock = (local: number, zone: IcsBlock): number | null => {
  const observances = observancesOf(zone)
  if (observances.length === 0) return null
  const changes = changesAround(observances, new Date(local).getUTCFullYear())
  const offsetAtMs = (ms: number) => {
    const last = changes.filter(change => change.at <= ms).at(-1)

    return last === undefined ? (changes[0]?.from ?? observances[0]!.from) : last.to
  }
  const offsets = [...new Set(changes.flatMap(change => [change.from, change.to]))]
  const fits = offsets.map(offset => local - offset * MINUTE).filter(ms => offsetAtMs(ms) * MINUTE === local - ms)

  return fits.length > 0 ? Math.min(...fits) : local - offsetAtMs(local) * MINUTE
}
