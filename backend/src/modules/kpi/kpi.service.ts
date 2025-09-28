import { getKpiRowsByInterval } from './dbQueries/getKpiRowsByInterval'
import { avgDeposit, avgFD, avgRD, rdPerFd, reg2Dep, reg2Try, try2Rd } from './formulas'
import { KpiArgs } from './types'
import { getTable } from './utils/getTable'

export class KpiService {
  static async getKpiStats(args: KpiArgs) {
    const { from, to, interval, timezone, currencies } = args
    const table = getTable(interval)

    const rows = await getKpiRowsByInterval(table, from, to, timezone, currencies, interval)

    return rows.map((r) => ({
      bucketStart: r.bucket_start,
      firstDepositCount: Number(r.first_deposit_count),
      reg2Try: reg2Try(Number(r.registrations), Number(r.try_count)),
      reg2Dep: reg2Dep(Number(r.registrations), Number(r.first_deposit_count)),
      avgFD: avgFD(Number(r.first_deposit_sum), Number(r.first_deposit_count)),
      rdPerFd: rdPerFd(Number(r.repeat_deposit_count), Number(r.first_deposit_count)),
      try2Rd: try2Rd(Number(r.try_count), Number(r.repeat_deposit_count)),
      avgRD: avgRD(Number(r.repeat_deposit_sum), Number(r.repeat_deposit_count)),
      avgDeposit: avgDeposit(Number(r.total_deposit_sum), Number(r.total_deposit_count)),
    }))
  }
}
