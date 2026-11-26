import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

import { NOTE_BREW_DRAG_TYPE } from '../../../../core/constants/constants'

type DragEvent = JSX.TargetedDragEvent<HTMLElement>

export type BrewDrag = ReturnType<typeof useBrewDrag>

// Only a drag begun by this realm's robot can start a review. A matching MIME
// type from another window, a file or selected text is not enough. A drag that
// ends without reaching a note calls onMiss.
export const useBrewDrag = (realm: string, onMiss: () => void) => {
  const active = useRef(false)
  const isLanded = useRef(false)
  const [isDragging, setDragging] = useState(false)
  const [over, setOver] = useState<string | null>(null)
  const end = () => {
    active.current = false
    setDragging(false)
    setOver(null)
  }
  useEffect(() => {
    window.addEventListener('drop', end)
    window.addEventListener('dragend', end)
    window.addEventListener('blur', end)

    return () => {
      window.removeEventListener('drop', end)
      window.removeEventListener('dragend', end)
      window.removeEventListener('blur', end)
    }
  }, [])
  const accepts = (event: DragEvent) => active.current && Array.from(event.dataTransfer?.types ?? []).includes(NOTE_BREW_DRAG_TYPE)

  const source: JSX.HTMLAttributes<HTMLSpanElement> = {
    draggable: true,
    onDragStart: event => {
      if (event.dataTransfer === null) return
      // No text/plain payload: a drop on a field must never insert text.
      event.dataTransfer.setData(NOTE_BREW_DRAG_TYPE, realm)
      event.dataTransfer.effectAllowed = 'copy'
      active.current = true
      isLanded.current = false
      setDragging(true)
    },
    onDragEnd: () => {
      end()
      if (!isLanded.current) onMiss()
    },
  }
  const target = (id: string, isLive: boolean, onDrop: () => void) => ({
    'data-brew-target': isLive && isDragging ? 'true' : undefined,
    'data-brew-over': isLive && isDragging && over === id ? 'true' : undefined,
    onDragOver: (event: DragEvent) => {
      if (!isLive || !accepts(event)) return
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer!.dropEffect = 'copy'
      setOver(id)
    },
    onDragLeave: (event: DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(was => was === id ? null : was)
    },
    onDrop: (event: DragEvent) => {
      if (!isLive || !accepts(event)) return
      event.preventDefault()
      event.stopPropagation()
      const isFromHere = event.dataTransfer!.getData(NOTE_BREW_DRAG_TYPE) === realm
      end()
      if (!isFromHere) return
      isLanded.current = true
      onDrop()
    },
  })

  return { isDragging, source, target }
}
