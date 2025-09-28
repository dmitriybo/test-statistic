import { refreshKpiHourlyAgg } from './refreshKpiHourlyAgg'
import { refreshMaterializedView } from './refreshMaterializedView'

export const refreshKpiImmediately = async () => {
  await refreshKpiHourlyAgg()
  await refreshMaterializedView('mv_kpi_daily')
  await refreshMaterializedView('mv_kpi_weekly')
  await refreshMaterializedView('mv_kpi_monthly')
}
