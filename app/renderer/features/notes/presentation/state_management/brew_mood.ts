import { useEffect, useRef, useState } from 'preact/hooks'

import { BREW_REACTION_MS } from '../../../../core/constants/constants'
import { brewMoodOf } from '../../domain/notes_view'
import type { BrewActivity, BrewMood, BrewReaction } from '../../domain/notes_view'

export type BrewMoodState = ReturnType<typeof useBrewMood>

// What the robot in the editor's foot is doing. The page keeps it, beside the
// drag, so a drop on the list, a save and filing all reach the same robot.
// A reaction shows for a moment and then settles back.
export const useBrewMood = () => {
  const [activity, setActivity] = useState<BrewActivity | null>(null)
  const [reaction, setReaction] = useState<BrewReaction | null>(null)
  const [isNear, setNear] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  const react = (kind: BrewReaction) => {
    if (timer.current !== null) clearTimeout(timer.current)
    setReaction(kind)
    timer.current = setTimeout(() => {
      timer.current = null
      setReaction(null)
    }, BREW_REACTION_MS[kind])
  }

  // Keeps the robot busy for one step, however the step ends. A new step
  // starts fresh, so an old reaction doesn't linger behind it.
  const busyWhile = async <T>(kind: BrewActivity, step: () => Promise<T>): Promise<T> => {
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = null
    setReaction(null)
    setActivity(kind)
    try {
      return await step()
    } finally {
      setActivity(null)
    }
  }

  // The pointer over the card. A drag carries the robot away, so it counts
  // until the drag starts and again once the pointer comes back.
  const near = {
    onMouseOver: () => setNear(true),
    onMouseLeave: () => setNear(false),
    onDragStart: () => setNear(false),
  }

  const moodWith = (isDragging: boolean): BrewMood => brewMoodOf({ activity, reaction, isNear: isNear || isDragging })

  return { moodWith, near, react, busyWhile }
}
