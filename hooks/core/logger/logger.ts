// A failure, for the debug log.
export function debug(to: { log: (text: string) => void }, what: string, err: unknown) {
  to.log(`${what}: ${err instanceof Error ? err.message : String(err)}`)
}
