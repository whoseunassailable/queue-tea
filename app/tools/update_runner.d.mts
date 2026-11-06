import type { UpdateState } from '../shared/update'
import type { Provenance } from './release_guard.mjs'
export type PublishedRequest = { repo: string; remote: string; branch: string; commit: string; repository?: string }
export function publishedSource(request: PublishedRequest): Promise<Provenance | null>
export function updateFolder(): string
export function readUpdate(folder?: string): Promise<(UpdateState & { repository: string }) | null>
export function queuePublished(request: PublishedRequest, options?: { repository?: string; folder?: string; tools?: string; executable?: string; retry?: boolean }): Promise<boolean>
export function runUpdates(folder?: string, options?: { target?: string; tools?: string; command?: (argv: string[], cwd: string, env: NodeJS.ProcessEnv) => Promise<void> }): Promise<void>
