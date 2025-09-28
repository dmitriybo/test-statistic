import { Interval } from '../types'

export const getTable = (interval: Interval): string => {
  switch (interval) {
    case 'HOUR':
      return 'kpi_hourly_agg'
    case 'DAY':
      return 'mv_kpi_daily'
    case 'WEEK':
      return 'mv_kpi_weekly'
    case 'MONTH':
      return 'mv_kpi_monthly'
  }
}
