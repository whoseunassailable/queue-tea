import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import type { Difficulty, ProjectRecord, Task } from '../../../../../../types'
import { emptyRecord, parseRecord } from '../../../../../../hooks/shared/records/data/datasources/record_source'
import { gameOf, levelOf, stageOf, xpOf } from './game'

let id = 0
const won = (finished: string, actual: Difficulty, over: Partial<Task> = {}): Task =>
  ({
    id: `t-${(id += 1)}`,
    title: 'x',
    state: 'done',
    priority: 'mid',
    difficulty: { expected: 'medium', actual },
    finished,
    created: finished,
    parentId: null,
    minutesByDay: {},
    ...over,
  }) as Task

const record = (tasks: Task[]): ProjectRecord => ({ ...emptyRecord('p', '/p'), tasks })
const NOW = Date.parse('2026-10-27T17:50:00+01:00')
const badge = (records: ProjectRecord[], which: string, now = NOW) => gameOf(records, 60, now).badges.find(b => b.id === which)!

// The records as of 27 Oct, from section 2.2 of the design.
const AS_OF_27_OCT = [
  record([
    won('2026-10-20T11:00:00+02:00', 'light'),
    won('2026-10-21T15:00:00+02:00', 'light'),
    won('2026-10-22T16:30:00+02:00', 'medium'),
    won('2026-10-27T03:30:00+01:00', 'hard'),
  ]),
  record([won('2026-10-20T14:00:00+02:00', 'medium')]),
]

describe('the rules', () => {
  it('pays by the actual difficulty', () => {
    expect([xpOf('light'), xpOf('medium'), xpOf('hard')]).toEqual([10, 25, 50])
    expect(gameOf([record([won('2026-10-20T11:00:00+02:00', 'hard', { difficulty: { expected: 'light', actual: 'hard' } })])], 60, NOW).xp).toBe(50)
  })

  it('counts levels as the design does', () => {
    expect(levelOf(0).level).toBe(1)
    expect(levelOf(99).level).toBe(1)
    expect(levelOf(100).level).toBe(2)
    expect(levelOf(300).level).toBe(3)
    expect(levelOf(1000).level).toBe(5)
    expect(levelOf(120)).toEqual({ level: 2, into: 20, toNext: 200 })
  })

  it('grows the dragon at the right levels', () => {
    expect([1, 2, 4, 5, 9, 10, 19, 20].map(stageOf)).toEqual(['egg', 'hatchling', 'hatchling', 'young', 'young', 'adult', 'adult', 'elder'])
  })
})

describe('the records as of 27 Oct', () => {
  const game = gameOf(AS_OF_27_OCT, 60, NOW)

  it('gives the figures in the design', () => {
    expect(game).toMatchObject({ victories: 5, xp: 120, gold: 120, level: 2, xpIntoLevel: 20, xpToNextLevel: 200, stage: 'hatchling', streak: 1, bestStreak: 3 })
  })

  it('earns First Flame and Night Owl and nothing else', () => {
    expect(game.badges.filter(b => b.earnedOn !== null).map(b => [b.id, b.earnedOn])).toEqual([
      ['firstFlame', '2026-10-20'],
      ['nightOwl', '2026-10-27'],
    ])
  })
})

describe('streaks', () => {
  const days = (...d: string[]) => [record(d.map(day => won(`${day}T12:00:00+01:00`, 'light')))]

  it('counts a run across midnight by the local day', () => {
    const late = won('2026-10-26T23:50:00+01:00', 'light')
    const early = won('2026-10-27T00:10:00+01:00', 'light')

    expect(gameOf([record([late, early])], 60, NOW).streak).toBe(2)
  })

  it('stays alive through the next day and dies the day after', () => {
    expect(gameOf(days('2026-10-26'), 60, NOW).streak).toBe(1)
    expect(gameOf(days('2026-10-25'), 60, NOW).streak).toBe(0)
  })

  it('is zero with no victories', () => {
    expect(gameOf([], 60, NOW)).toMatchObject({ streak: 0, bestStreak: 0, level: 1, stage: 'egg', xp: 0 })
  })
})

describe('badges', () => {
  it('Night Owl covers 22:00 to 03:59 and no later', () => {
    expect(badge([record([won('2026-10-20T22:00:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe('2026-10-20')
    expect(badge([record([won('2026-10-20T03:59:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe('2026-10-20')
    expect(badge([record([won('2026-10-20T04:00:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe(null)
    expect(badge([record([won('2026-10-20T21:59:00+01:00', 'light')])], 'nightOwl').earnedOn).toBe(null)
  })

  it('Early Bird covers 05:00 to 08:59', () => {
    expect(badge([record([won('2026-10-20T05:00:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe('2026-10-20')
    expect(badge([record([won('2026-10-20T08:59:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe('2026-10-20')
    expect(badge([record([won('2026-10-20T09:00:00+01:00', 'light')])], 'earlyBird').earnedOn).toBe(null)
  })

  it('Ten Tales is earned by the tenth, on its day', () => {
    const tasks = Array.from({ length: 10 }, (_, i) => won(`2026-10-${String(10 + i).padStart(2, '0')}T12:00:00+01:00`, 'light'))

    expect(badge([record(tasks.slice(0, 9))], 'tenTales')).toMatchObject({ have: 9, earnedOn: null })
    expect(badge([record(tasks)], 'tenTales')).toMatchObject({ have: 10, earnedOn: '2026-10-19' })
  })

  it('Dragon Slayer counts only Hard', () => {
    const hard = Array.from({ length: 5 }, (_, i) => won(`2026-10-1${i}T12:00:00+01:00`, 'hard'))

    expect(badge([record(hard.slice(0, 4))], 'dragonSlayer')).toMatchObject({ have: 4, earnedOn: null })
    expect(badge([record(hard)], 'dragonSlayer').earnedOn).toBe('2026-10-14')
  })

  it("Saga's End needs the saga and every chapter", () => {
    const saga = won('2026-10-20T12:00:00+01:00', 'light', { id: 'saga' })
    const chapter = won('2026-10-21T12:00:00+01:00', 'light', { parentId: 'saga' })
    const open = { ...chapter, id: 'open', state: 'queued', finished: null } as Task

    expect(badge([record([saga, chapter])], 'sagasEnd').earnedOn).toBe('2026-10-21')
    expect(badge([record([saga, chapter, open])], 'sagasEnd').earnedOn).toBe(null)
    expect(badge([record([saga])], 'sagasEnd').earnedOn).toBe(null)
  })

  it('Week of Fire needs seven days in a row', () => {
    const tasks = Array.from({ length: 7 }, (_, i) => won(`2026-10-1${i}T12:00:00+01:00`, 'light'))

    expect(badge([record(tasks.slice(0, 6))], 'weekOfFire')).toMatchObject({ have: 6, earnedOn: null })
    expect(badge([record(tasks)], 'weekOfFire').earnedOn).toBe('2026-10-16')
  })
})

describe('the game only reads', () => {
  it('leaves every record byte for byte the same', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'queue-tea-game-'))
    const file = join(dir, 'p.json')
    const text = JSON.stringify(AS_OF_27_OCT[0], null, 2)
    await writeFile(file, text)
    const read = parseRecord(await readFile(file, 'utf8'))
    if (read === 'unreadable') throw new Error('should read')

    gameOf([read], 60, NOW)

    expect(await readFile(file, 'utf8')).toBe(text)
    await rm(dir, { recursive: true, force: true })
  })
})
