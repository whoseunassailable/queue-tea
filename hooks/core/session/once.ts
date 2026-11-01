// One run at a time per key: a second press while the first runs does nothing.
const running = new Set<string>()
export const once = async <T>(key: string, work: () => Promise<T>, otherwise: T): Promise<T> => {
  if (running.has(key)) return otherwise
  running.add(key)
  try {
    return await work()
  } finally {
    running.delete(key)
  }
}
