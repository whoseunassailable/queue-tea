import type { Difficulty, ProjectRecord, Task } from '../../../../../../types'
import { childrenOf } from '../../../../../../hooks/shared/backlog/domain/services/families'
import { dayKey } from '../../../../../../hooks/shared/time/domain/services/time'
import { finishedTasks } from '../../../../../../hooks/shared/time/domain/services/week_stats'
import type { Badge, BadgeId, GameState, Stage } from '../../../../../shared/engine_api'

// Every game number, worked out from the records each time. Nothing here is
// stored, and nothing here writes.

const XP: Record<Difficulty, number> = { light: 10, medium: 25, hard: 50 }
const DAY_MS = 86_400_000

export const xpOf = (difficulty: Difficulty): number => XP[difficulty]

const actualOf = (task: Task): Difficulty => task.difficulty.actual ?? task.difficulty.expected

// Reaching level L + 1 takes 100 × L XP more than reaching level L.
export const levelOf = (xp: number): { level: number; into: number; toNext: number } => {
  let level = 1
  let spent = 0
  while (xp - spent >= 100 * level) {
    spent += 100 * level
    level += 1
  }

  return { level, into: xp - spent, toNext: 100 * level }
}

export const stageOf = (level: number): Stage => {
  if (level >= 20) return 'elder'
  if (level >= 10) return 'adult'
  if (level >= 5) return 'young'

  return level >= 2 ? 'hatchling' : 'egg'
}

// A task keeps the local time it was finished in, so the day and hour come
// from its own text.
const dayOf = (task: Task): string => task.finished!.slice(0, 10)
const hourOf = (task: Task): number => Number(task.finished!.slice(11, 13))

const nextDay = (day: string): string => new Date(Date.parse(`${day}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10)

// Runs of days in a row, oldest first.
const runsOf = (days: string[]): string[][] => {
  const runs: string[][] = []
  for (const day of [...new Set(days)].sort()) {
    const run = runs.at(-1)
    if (run !== undefined && nextDay(run.at(-1)!) === day) run.push(day)
    else runs.push([day])
  }

  return runs
}

// A streak is alive through today: yesterday's run hasn't been missed yet.
const streakOf = (runs: string[][], today: string): number => {
  const last = runs.at(-1)
  if (last === undefined) return 0
  const end = last.at(-1)!

  return end === today || nextDay(end) === today ? last.length : 0
}

const countBadge = (id: BadgeId, need: number, wins: Task[]): Badge => {
  const reached = wins[need - 1]

  return { id, need, have: Math.min(wins.length, need), earnedOn: reached === undefined ? null : dayOf(reached) }
}

// The day a saga and every chapter were all won, or null.
const sagaWonOn = (saga: Task, tasks: Task[]): string | null => {
  const chapters = childrenOf(saga, tasks)
  const whole = [saga, ...chapters]
  if (chapters.length === 0 || whole.some(t => t.state !== 'done' || t.finished === null)) return null

  return whole.map(dayOf).sort().at(-1)!
}

const sagasEndOf = (records: ProjectRecord[]): Badge => {
  const days = records.flatMap(r => r.tasks.map(t => sagaWonOn(t, r.tasks))).filter((d): d is string => d !== null)

  return { id: 'sagasEnd', need: 1, have: Math.min(days.length, 1), earnedOn: days.sort()[0] ?? null }
}

const weekOfFireOf = (runs: string[][], best: number): Badge => {
  const run = runs.find(r => r.length >= 7)

  return { id: 'weekOfFire', need: 7, have: Math.min(best, 7), earnedOn: run?.[6] ?? null }
}

export const gameOf = (records: ProjectRecord[], offsetMinutes: number, nowMs: number): GameState => {
  // Oldest first, so the nth win is the one that earned a count badge.
  const wins = records.flatMap(r => finishedTasks(r.tasks)).sort((a, b) => Date.parse(a.finished!) - Date.parse(b.finished!))
  const xp = wins.reduce((sum, t) => sum + xpOf(actualOf(t)), 0)
  const { level, into, toNext } = levelOf(xp)
  const runs = runsOf(wins.map(dayOf))
  const best = runs.reduce((most, run) => Math.max(most, run.length), 0)
  const hours = (test: (hour: number) => boolean) => wins.filter(t => test(hourOf(t)))

  return {
    victories: wins.length,
    xp,
    gold: xp,
    level,
    xpIntoLevel: into,
    xpToNextLevel: toNext,
    stage: stageOf(level),
    streak: streakOf(runs, dayKey(nowMs, offsetMinutes)),
    bestStreak: best,
    badges: [
      countBadge('firstFlame', 1, wins),
      countBadge('tenTales', 10, wins),
      countBadge('dragonSlayer', 5, wins.filter(t => actualOf(t) === 'hard')),
      sagasEndOf(records),
      countBadge('earlyBird', 1, hours(h => h >= 5 && h <= 8)),
      countBadge('nightOwl', 1, hours(h => h >= 22 || h <= 3)),
      weekOfFireOf(runs, best),
    ],
  }
}
