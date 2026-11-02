import { describe, expect, it } from 'vitest'

import type { GameState } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'
import { activeQuest, GAME, projectView, quest } from '../../../test_support'
import { isStreakAtRisk, momentumOf, questAheadOf } from './momentum'

const game = (over: Partial<GameState> = {}): GameState => ({ ...GAME, xpIntoLevel: 150, xpToNextLevel: 200, level: 2, stage: 'hatchling', streak: 3, bestStreak: 5, wonToday: true, badges: [], ...over })
const QUEST = { title: 'Fix the docs', xp: 25 }

describe('the bar', () => {
  it('fills to where you are', () => {
    expect(momentumOf(game(), null).share).toBe(0.75)
  })

  it('shows what the quest in hand would add', () => {
    expect(momentumOf(game(), QUEST).gain).toBe(0.125)
  })

  it('stops the gain at the end of the level', () => {
    expect(momentumOf(game(), { ...QUEST, xp: 500 }).gain).toBe(0.25)
  })

  it('has no gain with no quest', () => {
    expect(momentumOf(game(), null).gain).toBe(0)
  })

  it('says how far to the next level', () => {
    expect(momentumOf(game(), null).headline).toBe(t.hud.toGo(50, 3))
  })
})

describe('the line that keeps you going', () => {
  it('leads with a level the quest in hand reaches', () => {
    const momentum = momentumOf(game({ xpIntoLevel: 190 }), QUEST)

    expect(momentum.hook).toBe(t.hud.levelsUp('Fix the docs', 3))
    expect(momentum.isClose).toBe(true)
  })

  it('counts a quest worth exactly what\'s left', () => {
    expect(momentumOf(game({ xpIntoLevel: 175 }), QUEST).hook).toBe(t.hud.levelsUp('Fix the docs', 3))
  })

  it('doesn\'t promise a level one XP short', () => {
    expect(momentumOf(game({ xpIntoLevel: 174 }), QUEST).hook).toBe(t.hud.questsToGo(2, 25, 3))
  })

  it('warns of a streak still to keep today', () => {
    expect(momentumOf(game({ wonToday: false, streak: 3 }), null).hook).toBe(t.hud.keepStreak(3))
    expect(isStreakAtRisk(game({ wonToday: false, streak: 3 }))).toBe(true)
  })

  it('counts a streak of one as one to keep', () => {
    expect(momentumOf(game({ wonToday: false, streak: 1 }), null).hook).toBe(t.hud.keepStreak(1))
  })

  it('has no streak to warn of with none going', () => {
    expect(isStreakAtRisk(game({ wonToday: false, streak: 0 }))).toBe(false)
  })

  it('has no streak to warn of once today has counted', () => {
    expect(isStreakAtRisk(game({ wonToday: true, streak: 3 }))).toBe(false)
  })

  it('puts a level before a streak, since the win does both', () => {
    expect(momentumOf(game({ xpIntoLevel: 190, wonToday: false }), QUEST).hook).toBe(t.hud.levelsUp('Fix the docs', 3))
  })

  it('says how many quests like this one reach the level', () => {
    expect(momentumOf(game(), { ...QUEST, xp: 10 }).hook).toBe(t.hud.questsToGo(5, 10, 3))
  })

  it('points to the nearest badge with no quest in hand', () => {
    const badges: GameState['badges'] = [
      { id: 'tenTales', need: 10, have: 9, earnedOn: null },
      { id: 'dragonSlayer', need: 5, have: 1, earnedOn: null },
    ]

    expect(momentumOf(game({ badges }), null).hook).toBe(t.hud.nearBadge(1, t.badges.tenTales))
  })

  it('ignores a badge already earned, or with nothing to count', () => {
    const badges: GameState['badges'] = [
      { id: 'tenTales', need: 10, have: 10, earnedOn: '2026-10-20' },
      { id: 'earlyBird', need: 1, have: 0, earnedOn: null },
    ]

    expect(momentumOf(game({ badges }), null).hook).toBe(t.hud.grows(t.stage.hatchling, 5))
  })

  it('falls back on how the dragon grows', () => {
    expect(momentumOf(game(), null).hook).toBe(t.hud.grows(t.stage.hatchling, 5))
  })

  it('still has something to say for an elder', () => {
    expect(momentumOf(game({ stage: 'elder', level: 22 }), null).hook).toBe(t.hud.elder)
  })
})

describe('being close', () => {
  it('is close within a quest of the level', () => {
    expect(momentumOf(game({ xpIntoLevel: 180 }), QUEST).isClose).toBe(true)
  })

  it('is close at nine tenths with no quest', () => {
    expect(momentumOf(game({ xpIntoLevel: 180 }), null).isClose).toBe(true)
  })

  it('isn\'t close otherwise', () => {
    expect(momentumOf(game(), QUEST).isClose).toBe(false)
  })
})

describe('the quest ahead', () => {
  const view = (over: Parameters<typeof projectView>[1]) => projectView('a-000001', over) as Extract<ReturnType<typeof projectView>, { kind: 'readable' }>

  it('is the quest in hand first', () => {
    expect(questAheadOf(view({ active: activeQuest({ title: 'In hand', xp: 50 }), ready: [{ kind: 'quest', quest: quest({ id: 'x', isStar: true }) }] }))).toEqual({ title: 'In hand', xp: 50 })
  })

  it('is the main quest with none in hand', () => {
    expect(questAheadOf(view({ ready: [{ kind: 'quest', quest: quest({ id: 'x' }) }, { kind: 'quest', quest: quest({ id: 'star', title: 'The star', isStar: true, xp: 10 }) }] }))).toEqual({ title: 'The star', xp: 10 })
  })

  it('is nothing with no realm, or nothing to do', () => {
    expect(questAheadOf(null)).toBeNull()
    expect(questAheadOf(view({}))).toBeNull()
  })
})
