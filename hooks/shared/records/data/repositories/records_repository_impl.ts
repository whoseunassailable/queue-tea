import type { Ctx } from '../../../../core/env/env'
import type { Host } from '../../../../core/host/host'
import type { RecordsRepository } from '../../domain/repositories/records_repository'
import { readOthers, readProblem, readRecord, restoreRecord, updateRecord } from '../datasources/record_source'

export const recordsRepositoryImpl = (host: Host, ctx: Ctx): RecordsRepository => ({
  read: () => readRecord(host, ctx.file, ctx.projectName, ctx.projectPath),
  update: fn => updateRecord(host, ctx.file, fn, ctx.projectName, ctx.projectPath),
  problem: () => readProblem(host, ctx.file),
  restore: stamp => restoreRecord(host, ctx.file, stamp),
  others: title => readOthers(host, ctx.file, title),
})
