// The first balanced JSON object in a reply, strings respected.
export const firstObject = (reply: string): string | null => {
  const start = reply.indexOf('{')
  if (start < 0) return null
  let depth = 0
  let inString = false
  for (let i = start; i < reply.length; i += 1) {
    const c = reply[i]
    if (inString) {
      if (c === '\\') i += 1
      else if (c === '"') inString = false
    } else if (c === '"') inString = true
    else if (c === '{') depth += 1
    else if (c === '}') {
      depth -= 1
      if (depth === 0) return reply.slice(start, i + 1)
    }
  }

  return null
}
