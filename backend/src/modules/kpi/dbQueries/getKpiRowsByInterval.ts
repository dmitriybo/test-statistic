import { DateTime } from 'luxon'

import { prisma } from '../../../config/prisma/prisma'
import { Interval, KpiRow } from '../types'

export const getKpiRowsByInterval = async (
  table: string,
  from: Date,
  to: Date,
  timezone = 'UTC',
  currencies: string[] = [],
  interval: Interval,
) => {
  let fromLocal = DateTime.fromJSDate(from, { zone: 'utc' }).setZone(timezone).toJSDate()
  let toLocal = DateTime.fromJSDate(to, { zone: 'utc' }).setZone(timezone).plus({ days: 1 }).toJSDate()

  if (interval === 'WEEK') {
    fromLocal = DateTime.fromJSDate(fromLocal).startOf('week').toJSDate()
    toLocal = DateTime.fromJSDate(toLocal).endOf('week').toJSDate()
  }
  if (interval === 'MONTH') {
    fromLocal = DateTime.fromJSDate(fromLocal).startOf('month').toJSDate()
    toLocal = DateTime.fromJSDate(toLocal).endOf('month').toJSDate()
  }

  if (currencies?.length) {
    return prisma.$queryRawUnsafe<KpiRow[]>(
      `
      SELECT
        bucket_start AT TIME ZONE 'UTC' AT TIME ZONE $3 AS bucket_start,
        MAX(registrations) AS registrations,
        MAX(try_count) AS try_count,
        SUM(first_deposit_count) AS first_deposit_count,
        SUM(first_deposit_sum) AS first_deposit_sum,
        SUM(repeat_deposit_count) AS repeat_deposit_count,
        SUM(repeat_deposit_sum) AS repeat_deposit_sum,
        SUM(total_deposit_count) AS total_deposit_count,
        SUM(total_deposit_sum) AS total_deposit_sum
      FROM ${table}
      WHERE bucket_start >= $1
        AND bucket_start < $2
        AND currency_code = ANY($4)
      GROUP BY bucket_start
      ORDER BY bucket_start
      `,
      fromLocal,
      toLocal,
      timezone,
      currencies,
    )
  }

  return prisma.$queryRawUnsafe<KpiRow[]>(
    `
    SELECT
      bucket_start AT TIME ZONE 'UTC' AT TIME ZONE $3 AS bucket_start,
      MAX(registrations) AS registrations,
      MAX(try_count) AS try_count,
      SUM(first_deposit_count) AS first_deposit_count,
      SUM(first_deposit_sum) AS first_deposit_sum,
      SUM(repeat_deposit_count) AS repeat_deposit_count,
      SUM(repeat_deposit_sum) AS repeat_deposit_sum,
      SUM(total_deposit_count) AS total_deposit_count,
      SUM(total_deposit_sum) AS total_deposit_sum
    FROM ${table}
    WHERE bucket_start >= $1
      AND bucket_start < $2
    GROUP BY bucket_start
    ORDER BY bucket_start
    `,
    fromLocal,
    toLocal,
    timezone,
  )
}
