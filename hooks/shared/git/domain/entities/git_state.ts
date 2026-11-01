export type GitState = {
  isRepo: boolean
  branch: string | null
  isDetached: boolean
  head: string | null
  uncommitted: number
  unpushed: number
  hasUpstream: boolean
}
