import { createServer } from 'node:http'
import type { RequestListener, Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import { afterEach, describe, expect, it } from 'vitest'

import { MESSAGES } from '../../../core/messages'
import { Refusal } from '../../../core/reply'
import { isPublicAddress, readPage } from './bookmark_page'

// Every page here is served on this Mac, so no test reaches the internet.
const servers: Server[] = []
const serve = async (handler: RequestListener, host = '127.0.0.1') => {
  const paths: string[] = []
  const server = createServer((request, response) => {
    paths.push(request.url ?? '')
    handler(request, response)
  })
  // The reader hangs up once it has enough, which the server may see as an error.
  server.on('clientError', (_err, socket) => socket.destroy())
  servers.push(server)
  await new Promise<void>(done => server.listen(0, host, done))
  const { port } = server.address() as AddressInfo

  return { paths, port, url: (path = '/') => `http://${host.includes(':') ? `[${host}]` : host}:${port}${path}` }
}
const html = (body: string, type = 'text/html; charset=utf-8'): RequestListener => (_, response) => {
  response.writeHead(200, { 'content-type': type })
  response.end(body)
}
const anyHost = () => true

afterEach(async () => {
  for (const server of servers.splice(0)) {
    server.closeAllConnections()
    await new Promise(done => server.close(done))
  }
})

const refusalOf = async (work: Promise<unknown>) => {
  const err = await work.then(() => null, (failure: unknown) => failure)
  expect(err).toBeInstanceOf(Refusal)

  return (err as Refusal).message
}

describe('which addresses are public', () => {
  it('refuses this Mac, private networks, link-local, carrier NAT, documentation, multicast and broadcast IPv4', () => {
    for (const address of ['0.0.0.0', '0.1.2.3', '10.0.0.1', '10.255.255.255', '100.64.0.1', '100.127.255.255', '127.0.0.1', '127.255.255.254', '169.254.169.254', '172.16.0.1', '172.31.255.255', '192.0.0.1', '192.0.2.1', '192.168.1.1', '198.18.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '239.255.255.255', '240.0.0.1', '255.255.255.255']) expect(isPublicAddress(address), address).toBe(false)
  })

  it('takes the public IPv4 addresses just outside those ranges', () => {
    for (const address of ['8.8.8.8', '1.1.1.1', '9.255.255.255', '11.0.0.0', '100.63.255.255', '100.128.0.0', '126.255.255.255', '128.0.0.0', '172.15.255.255', '172.32.0.1', '192.167.255.255', '192.169.0.0', '223.255.255.255']) expect(isPublicAddress(address), address).toBe(true)
  })

  it('refuses every IPv6 address outside global unicast, IPv4-mapped, NAT64, 6to4, Teredo and documentation included', () => {
    for (const address of ['::', '::1', 'fe80::1', 'FE80::1', 'fc00::1', 'fd00::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:8.8.8.8', '::ffff:7f00:1', '64:ff9b::808:808', '2002::1', '2002:c0a8:101::1', '2001::1', '2001:db8::1', '4000::1', '8000::1']) expect(isPublicAddress(address), address).toBe(false)
  })

  it('takes public IPv6 addresses', () => {
    for (const address of ['2606:4700::1', '2606:4700:4700::1111', '2001:4860:4860::8888', '2a00:1450:4001::1']) expect(isPublicAddress(address), address).toBe(true)
  })

  it('refuses what is not an address at all', () => {
    for (const address of ['', 'example.com', 'localhost', '127.1', '1.2.3.256']) expect(isPublicAddress(address), address).toBe(false)
  })
})

describe('reading a page', () => {
  it('gives the page’s HTML', async () => {
    const page = await serve(html('<title>Hello</title>'))
    expect(await readPage(page.url('/post'), anyHost)).toBe('<title>Hello</title>')
    expect(page.paths).toEqual(['/post'])
  })

  it('decodes the page in the charset its Content-Type names, and as UTF-8 when the name is unknown', async () => {
    const latin = await serve((_, response) => {
      response.writeHead(200, { 'content-type': 'text/html; charset="ISO-8859-1"' })
      response.end(Buffer.from([0x43, 0x61, 0x66, 0xe9]))
    })
    expect(await readPage(latin.url(), anyHost)).toBe('Café')
    const unknown = await serve(html('Café', 'text/html; charset=no-such-charset'))
    expect(await readPage(unknown.url(), anyHost)).toBe('Café')
  })

  it('gives no preview for a file that is not HTML, or an error status', async () => {
    const json = await serve(html('{"title":"no"}', 'application/json'))
    expect(await readPage(json.url(), anyHost)).toBe('')
    const untyped = await serve((_, response) => response.end('<title>no type</title>'))
    expect(await readPage(untyped.url(), anyHost)).toBe('')
    const missing = await serve((_, response) => {
      response.writeHead(404, { 'content-type': 'text/html' })
      response.end('<title>Not found</title>')
    })
    expect(await readPage(missing.url(), anyHost)).toBe('')
  })

  it('follows up to five redirects, relative ones included', async () => {
    const page = await serve((request, response) => {
      const left = Number(request.url!.slice(1))
      if (left === 0) return html('<title>Arrived</title>')(request, response)
      response.writeHead(302, { location: String(left - 1) })
      response.end()
    })
    expect(await readPage(page.url('/5'), anyHost)).toBe('<title>Arrived</title>')
    expect(page.paths).toEqual(['/5', '/4', '/3', '/2', '/1', '/0'])
  })

  it('gives no preview after the sixth redirect, and stops asking', async () => {
    const page = await serve((_, response) => {
      response.writeHead(301, { location: '/again' })
      response.end()
    })
    expect(await readPage(page.url('/again'), anyHost)).toBe('')
    expect(page.paths).toHaveLength(6)
  })

  it('gives no preview for a redirect to a scheme other than http or https', async () => {
    const page = await serve((_, response) => {
      response.writeHead(302, { location: 'file:///etc/passwd' })
      response.end()
    })
    expect(await readPage(page.url(), anyHost)).toBe('')
  })

  it('reads at most 512 KB of a page', async () => {
    const page = await serve(html('a'.repeat(600 * 1024)))
    expect(Buffer.byteLength(await readPage(page.url(), anyHost))).toBe(512 * 1024)
  })
})

describe('the private-address guard', () => {
  it('refuses this Mac by address or by name before asking it anything', async () => {
    const page = await serve(html('<title>Secret</title>'))
    for (const url of [page.url(), `http://localhost:${page.port}/`, `http://127.1:${page.port}/`, `http://0x7f000001:${page.port}/`]) expect(await refusalOf(readPage(url)), url).toBe(MESSAGES.bookmarkPrivate)
    expect(page.paths).toEqual([])
  })

  it('refuses an IPv6 literal on this Mac', async () => {
    const page = await serve(html('<title>Secret</title>'), '::1')
    expect(await refusalOf(readPage(page.url()))).toBe(MESSAGES.bookmarkPrivate)
    expect(page.paths).toEqual([])
  })

  it('checks every redirect again, so a public page cannot send the reader inwards', async () => {
    const inside = await serve(html('<title>Secret</title>'), '::1')
    const outside = await serve((_, response) => {
      response.writeHead(302, { location: inside.url() })
      response.end()
    })
    // Here 127.0.0.1 stands for a public address and ::1 for a private one.
    expect(await refusalOf(readPage(outside.url(), address => address === '127.0.0.1'))).toBe(MESSAGES.bookmarkPrivate)
    expect(outside.paths).toEqual(['/'])
    expect(inside.paths).toEqual([])
  })

  it('refuses a name when any of its answers is private', async () => {
    const page = await serve(html('<title>Secret</title>'))
    // localhost answers 127.0.0.1 and ::1 here; refusing either refuses the name.
    expect(await refusalOf(readPage(`http://localhost:${page.port}/`, address => address !== '127.0.0.1'))).toBe(MESSAGES.bookmarkPrivate)
    expect(page.paths).toEqual([])
  })
})

describe('a slow page', () => {
  it('that never answers gives up after five seconds', async () => {
    const page = await serve(() => {})
    const started = Date.now()
    expect(await refusalOf(readPage(page.url(), anyHost))).toBe(MESSAGES.bookmarkSlow)
    expect(Date.now() - started).toBeGreaterThanOrEqual(4_900)
    expect(Date.now() - started).toBeLessThan(7_000)
  })

  it('that stops halfway through its body gives up after five seconds in all', async () => {
    const page = await serve((_, response) => {
      response.writeHead(200, { 'content-type': 'text/html' })
      response.write('<title>Half')
    })
    const started = Date.now()
    expect(await refusalOf(readPage(page.url(), anyHost))).toBe(MESSAGES.bookmarkSlow)
    expect(Date.now() - started).toBeLessThan(7_000)
  })
})
