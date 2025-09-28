export interface KpiRow {
  bucketStart: string
  firstDepositCount: number
  reg2Try: number
  reg2Dep: number
  avgFD: number
  rdPerFd: number
  try2Rd: number
  avgRD: number
  avgDeposit: number
}

export interface Currency {
  code: string
  name: string
  symbol: string
}
