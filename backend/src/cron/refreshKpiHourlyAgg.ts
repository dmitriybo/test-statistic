import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function refreshKpiHourlyAgg() {
  const start = new Date()
  console.log(`[${start.toISOString()}] Refreshing kpi_hourly_agg...`)

  try {
    await prisma.$executeRaw`
        WITH first_registration AS (
            SELECT MIN(created_at) AS first_user_at
            FROM "users"
        ),
             last_bucket AS (
                 SELECT currency_code, MAX(bucket_start) AS last_hour
                 FROM kpi_hourly_agg
                 GROUP BY currency_code
             ),
             hours AS (
                 SELECT
                     c.code AS currency_code,
                     generate_series(
                             GREATEST(
                                     COALESCE(lb.last_hour + interval '1 hour', date_trunc('hour', NOW() - interval '1 year')),
                                     date_trunc('hour', fr.first_user_at)
                             ),
                             date_trunc('hour', NOW()),
                             interval '1 hour'
                     ) AS bucket_start
                 FROM currencies c
                          LEFT JOIN last_bucket lb ON c.code = lb.currency_code
                          CROSS JOIN first_registration fr
                 WHERE fr.first_user_at IS NOT NULL
             ),
             user_hours AS (
                 SELECT date_trunc('hour', created_at) AS bucket_start,
                        COUNT(*) AS registrations
                 FROM "users"
                 GROUP BY 1
             ),
             try_hours AS (
                 SELECT date_trunc('hour', created_at) AS bucket_start,
                        COUNT(*) AS try_count
                 FROM tries
                 WHERE is_first = TRUE
                 GROUP BY 1
             ),
             deposit_hours AS (
                 SELECT date_trunc('hour', created_at) AS bucket_start,
                        currency_code,
                        COUNT(*) FILTER (WHERE is_first = TRUE) AS first_deposit_count,
                     COALESCE(SUM(amount) FILTER (WHERE is_first = TRUE),0) AS first_deposit_sum,
                        COUNT(*) FILTER (WHERE is_first = FALSE) AS repeat_deposit_count,
                     COALESCE(SUM(amount) FILTER (WHERE is_first = FALSE),0) AS repeat_deposit_sum,
                        COUNT(*) AS total_deposit_count,
                        COALESCE(SUM(amount),0) AS total_deposit_sum
                 FROM deposits
                 GROUP BY 1,2
             )
        INSERT INTO kpi_hourly_agg (
          bucket_start,
          currency_code,
          registrations,
          try_count,
          first_deposit_count,
          first_deposit_sum,
          repeat_deposit_count,
          repeat_deposit_sum,
          total_deposit_count,
          total_deposit_sum
        )
        SELECT
            h.bucket_start,
            h.currency_code,
            COALESCE(u.registrations,0),
            COALESCE(t.try_count,0),
            COALESCE(d.first_deposit_count,0),
            COALESCE(d.first_deposit_sum,0),
            COALESCE(d.repeat_deposit_count,0),
            COALESCE(d.repeat_deposit_sum,0),
            COALESCE(d.total_deposit_count,0),
            COALESCE(d.total_deposit_sum,0)
        FROM hours h
                 LEFT JOIN user_hours u ON h.bucket_start = u.bucket_start
                 LEFT JOIN try_hours t ON h.bucket_start = t.bucket_start
                 LEFT JOIN deposit_hours d ON h.bucket_start = d.bucket_start AND h.currency_code = d.currency_code
            ON CONFLICT (bucket_start, currency_code) DO NOTHING;
    `

    const end = new Date()
    console.log(`[${end.toISOString()}] kpi_hourly_agg refreshed successfully. (${end.getTime() - start.getTime()}ms)`)
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error refreshing kpi_hourly_agg:`, err)
  }
}
