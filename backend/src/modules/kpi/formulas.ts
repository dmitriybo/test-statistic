const DECIMAL_PLACES = 2

const round = (value: number) => Math.round(value * 10 ** DECIMAL_PLACES) / 10 ** DECIMAL_PLACES

export const reg2Try = (registrations: number, tryCount: number) =>
  registrations ? round((tryCount / registrations) * 100) : 0

export const reg2Dep = (registrations: number, firstDepositCount: number) =>
  registrations ? round((firstDepositCount / registrations) * 100) : 0

export const avgFD = (firstDepositSum: number, firstDepositCount: number) =>
  firstDepositCount ? round(firstDepositSum / firstDepositCount) : 0

export const rdPerFd = (repeatDepositCount: number, firstDepositCount: number) =>
  firstDepositCount ? round(repeatDepositCount / firstDepositCount) : 0

export const try2Rd = (tryCount: number, repeatDepositCount: number) =>
  tryCount ? round((repeatDepositCount / tryCount) * 100) : 0

export const avgRD = (repeatDepositSum: number, repeatDepositCount: number) =>
  repeatDepositCount ? round(repeatDepositSum / repeatDepositCount) : 0

export const avgDeposit = (totalDepositSum: number, totalDepositCount: number) =>
  totalDepositCount ? round(totalDepositSum / totalDepositCount) : 0
