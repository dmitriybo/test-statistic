import dotenv from 'dotenv'
import cron from 'node-cron'

import { refreshKpiHourlyAgg } from './refreshKpiHourlyAgg'
import { refreshKpiImmediately } from './refreshKpiImmediately'
import { refreshMaterializedView } from './refreshMaterializedView'

dotenv.config()

const REFRESH_HOURLY = process.env.REFRESH_HOURLY || '1'
const REFRESH_DAILY = process.env.REFRESH_DAILY || '1'
const REFRESH_WEEKLY = process.env.REFRESH_WEEKLY || '1'
const REFRESH_MONTHLY = process.env.REFRESH_MONTHLY || '1'

let processedHourly = false

;(async () => {
  console.log(`[${new Date().toISOString()}] KPI refresh started...`)

  processedHourly = true
  await refreshKpiImmediately()
  processedHourly = false

  console.log(`[${new Date().toISOString()}] KPI refreshed successfully.`)
})()

cron.schedule(`*/${REFRESH_HOURLY} * * * *`, async () => {
  if (!processedHourly) {
    processedHourly = true
    await refreshKpiHourlyAgg()
    processedHourly = false
  }
})
cron.schedule(`*/${REFRESH_DAILY} * * * *`, () => refreshMaterializedView('mv_kpi_daily'))
cron.schedule(`*/${REFRESH_WEEKLY} * * * *`, () => refreshMaterializedView('mv_kpi_weekly'))
cron.schedule(`*/${REFRESH_MONTHLY} * * * *`, () => refreshMaterializedView('mv_kpi_monthly'))

console.log('KPI refresh cron jobs started...')
