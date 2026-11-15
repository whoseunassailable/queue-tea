import { lookup as dnsLookup } from 'node:dns'
import { get as getHttp } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { get as getHttps } from 'node:https'
import { BlockList, isIP } from 'node:net'
import type { LookupFunction } from 'node:net'

import { BOOKMARK_LIMITS } from '../../../../shared/note_bookmarks'
import { BOOKMARK_AGENT } from '../../../core/constants'
import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'

// A note's link reaches only the public internet: never this Mac, the local
// network or a cloud metadata service, whatever the link or its redirects say.
// One list per family: a BlockList checks IPv4 against IPv6 rules too, as
// ::ffff:a.b.c.d, and ::/3 below would then refuse every IPv4 address.
const PRIVATE = { ipv4: new BlockList(), ipv6: new BlockList() }
const RANGES = {
  ipv4: '0.0.0.0/8 10.0.0.0/8 100.64.0.0/10 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.0.0.0/24 192.0.2.0/24 192.168.0.0/16 198.18.0.0/15 198.51.100.0/24 203.0.113.0/24 224.0.0.0/3',
  // Everything outside global unicast (2000::/3), which takes in loopback,
  // IPv4-mapped and NAT64 addresses, then Teredo, documentation and 6to4.
  ipv6: '::/3 4000::/2 8000::/1 2001::/23 2001:db8::/32 2002::/16',
}
for (const family of ['ipv4', 'ipv6'] as const) {
  for (const range of RANGES[family].split(' ')) {
    const [net, bits] = range.split('/')
    PRIVATE[family].addSubnet(net!, Number(bits), family)
  }
}

export const isPublicAddress = (address: string): boolean => {
  const family = isIP(address) === 6 ? 'ipv6' : 'ipv4'

  return isIP(address) !== 0 && !PRIVATE[family].check(address, family)
}

class PrivateHost extends Error {}

// The guard sits in the lookup the connection itself uses, so a name can't
// answer one address to a check and another to the connection.
const lookupOf = (isPublic: (address: string) => boolean): LookupFunction => (hostname, options, done) =>
  dnsLookup(hostname, { ...options, all: true }, (error, found) => {
    if (error !== null) return done(error, '', 0)
    // One private answer refuses the name, so no record can steer a retry inwards.
    if (found.length === 0 || found.some(one => !isPublic(one.address))) return done(new PrivateHost(hostname), '', 0)
    if (options.all === true) return done(null, found)
    done(null, found[0]!.address, found[0]!.family)
  })

const getOnce = (url: URL, isPublic: (address: string) => boolean, signal: AbortSignal): Promise<IncomingMessage> =>
  new Promise((done, fail) => {
    const host = url.hostname.replace(/^\[(.*)\]$/, '$1')
    // A literal address skips the lookup, so it is checked here.
    if (isIP(host) !== 0 && !isPublic(host)) return fail(new PrivateHost(host))
    const get = url.protocol === 'https:' ? getHttps : getHttp
    get(url, { lookup: lookupOf(isPublic), signal, agent: false, headers: { accept: 'text/html,application/xhtml+xml', 'accept-encoding': 'identity', 'user-agent': BOOKMARK_AGENT } }, done).on('error', fail)
  })

const textOf = async (response: IncomingMessage, type: string): Promise<string> => {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of response as AsyncIterable<Buffer>) {
    chunks.push(chunk)
    size += chunk.length
    // The head is all a preview needs; leaving the loop closes the rest.
    if (size >= BOOKMARK_LIMITS.bytes) break
  }
  const bytes = Buffer.concat(chunks).subarray(0, BOOKMARK_LIMITS.bytes)
  // shortcut: reads the charset from the header only, not from <meta charset>; add that if previews show mojibake.
  const charset = /charset=["']?([\w-]+)/i.exec(type)?.[1] ?? 'utf-8'
  try {
    return new TextDecoder(charset).decode(bytes)
  } catch {
    // An unknown charset reads as UTF-8, which most pages are.
    return new TextDecoder().decode(bytes)
  }
}

// The page's HTML, or '' when it has no preview to give: an error status, a
// file that isn't HTML, or too many redirects.
export const readPage = async (address: string, isPublic: (address: string) => boolean = isPublicAddress): Promise<string> => {
  const signal = AbortSignal.timeout(BOOKMARK_LIMITS.timeoutMs)
  let url = new URL(address)
  try {
    for (let hop = 0; ; hop += 1) {
      const response = await getOnce(url, isPublic, signal)
      const status = response.statusCode ?? 0
      const location = response.headers.location
      if (status >= 300 && status < 400 && location !== undefined) {
        response.destroy()
        if (hop >= BOOKMARK_LIMITS.redirects) return ''
        url = new URL(location, url)
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
        continue
      }
      const type = response.headers['content-type'] ?? ''
      if (status < 200 || status >= 300 || !/html/i.test(type)) {
        response.destroy()

        return ''
      }

      return await textOf(response, type)
    }
  } catch (err) {
    if (err instanceof PrivateHost) throw new Refusal(MESSAGES.bookmarkPrivate)
    if (signal.aborted) throw new Refusal(MESSAGES.bookmarkSlow)
    throw err
  }
}
