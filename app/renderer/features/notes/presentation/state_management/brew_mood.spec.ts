// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BREW_REACTION_MS } from '../../../../core/constants/constants'
import { useBrewMood } from './brew_mood'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('the robot’s mood in the editor’s foot', () => {
  it('starts idle, hovers while the pointer is over the card or the robot is dragged, and settles when it leaves', () => {
    const { result } = renderHook(() => useBrewMood())
    expect(result.current.moodWith(false)).toBe('idle')
    expect(result.current.moodWith(true)).toBe('hover')
    act(() => result.current.near.onMouseOver())
    expect(result.current.moodWith(false)).toBe('hover')
    act(() => result.current.near.onMouseLeave())
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('forgets the pointer once a drag carries the robot off', () => {
    const { result } = renderHook(() => useBrewMood())
    act(() => result.current.near.onMouseOver())
    act(() => result.current.near.onDragStart())
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it.each(['success', 'confused', 'error'] as const)('shows %s for its moment, then settles back to idle', kind => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBrewMood())
    act(() => result.current.react(kind))
    expect(result.current.moodWith(false)).toBe(kind)
    act(() => void vi.advanceTimersByTime(BREW_REACTION_MS[kind] - 1))
    expect(result.current.moodWith(false)).toBe(kind)
    act(() => void vi.advanceTimersByTime(1))
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('a second reaction replaces the first and gets its own full moment', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBrewMood())
    act(() => result.current.react('success'))
    act(() => void vi.advanceTimersByTime(BREW_REACTION_MS.success - 100))
    act(() => result.current.react('confused'))
    act(() => void vi.advanceTimersByTime(200))
    expect(result.current.moodWith(false)).toBe('confused')
    act(() => void vi.advanceTimersByTime(BREW_REACTION_MS.confused))
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('is busy for exactly as long as the step runs, and passes the step’s answer on', async () => {
    const { result } = renderHook(() => useBrewMood())
    let finish!: (saved: boolean) => void
    let answer: Promise<boolean> | undefined
    act(() => {
      answer = result.current.busyWhile('thinking', () => new Promise<boolean>(resolve => { finish = resolve }))
    })
    expect(result.current.moodWith(true)).toBe('thinking')
    await act(async () => {
      finish(false)
      await answer
    })
    expect(await answer).toBe(false)
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('stops being busy when the step throws, and lets the error through', async () => {
    const { result } = renderHook(() => useBrewMood())
    let run: Promise<unknown> | undefined
    act(() => {
      run = result.current.busyWhile('working', () => Promise.reject(new Error('lost the queue')))
    })
    await act(async () => {
      await expect(run).rejects.toThrow('lost the queue')
    })
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('a new step clears a reaction still showing, so an old success doesn’t return after it', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBrewMood())
    act(() => result.current.react('success'))
    await act(async () => {
      await result.current.busyWhile('thinking', async () => true)
    })
    expect(result.current.moodWith(false)).toBe('idle')
  })

  it('leaves no timer running once the page goes', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(() => useBrewMood())
    act(() => result.current.react('error'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
