import { DateTime } from 'luxon'

import { prisma } from '../../../config/prisma/prisma'
import { KpiRow } from '../types'

export const getKpiRowsByInterval = async (
  table: string,
  from: Date,
  to: Date,
  timezone = 'UTC',
  currencies?: string[],
) => {
  const fromLocal = DateTime.fromISO(from.toISOString(), { zone: 'utc' }).setZone(timezone).toJSDate()
  const toLocal = DateTime.fromISO(to.toISOString(), { zone: 'utc' }).setZone(timezone).toJSDate()

  if (currencies?.length) {
    return prisma.$queryRawUnsafe<KpiRow[]>(
      `
      SELECT
        bucket_start AT TIME ZONE 'UTC' AT TIME ZONE $3 AS bucket_start,
        currency_code,
        SUM(registrations) AS registrations,
        SUM(try_count) AS try_count,
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
      GROUP BY bucket_start, currency_code
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
      bucket_start AT TIME ZONE $3 AS bucket_start,
      SUM(registrations) AS registrations,
      SUM(try_count) AS try_count,
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
