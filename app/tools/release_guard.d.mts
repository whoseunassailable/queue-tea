export type Provenance = { version: number; commit: string; branch: string; integration: string; dirty: boolean; builtAt: string }
export function currentProvenance(): Provenance
export function releaseProblem(candidate: Provenance | null, installed: { commit: string } | null, isAncestor: (old: string, next: string) => boolean): string | null
