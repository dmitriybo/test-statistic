export type Interval = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'

export interface KpiArgs {
  from: Date
  to: Date
  interval: Interval
  timezone?: string
  currencies?: string[]
}

export interface KpiRow {
  bucket_start: string
  registrations: bigint
  try_count: bigint
  first_deposit_count: bigint
  repeat_deposit_count: bigint
  total_deposit_count: bigint
  first_deposit_sum: bigint
  repeat_deposit_sum: bigint
  total_deposit_sum: bigint
}
