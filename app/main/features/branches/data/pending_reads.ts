// Share simultaneous UI reads, never a completed snapshot. Mutating operations
// use their own direct freshness checks and do not pass through this map.
const pending = new WeakMap<object, Map<string, Promise<unknown>>>()
export const pendingRead = <T>(owner: object, parts: unknown[], read: () => Promise<T>): Promise<T> => {
  // Invalid IPC input still reaches normal API validation, without serializing
  // arbitrary objects or allowing them to collide with a valid request.
  if (parts.some(part => part !== null && part !== undefined && typeof part !== 'string')) return read()
  const key = JSON.stringify(parts)
  let reads = pending.get(owner)
  if (!reads) { reads = new Map(); pending.set(owner, reads) }
  const existing = reads.get(key)
  if (existing) return existing as Promise<T>
  const result = read().finally(() => reads.delete(key))
  reads.set(key, result)
  return result
}
