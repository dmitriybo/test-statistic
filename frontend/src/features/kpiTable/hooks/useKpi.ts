import { useEffect, useRef } from 'react'

import { useKpiContext } from '@/features/kpiTable/context/KpiContext'
import { GET_KPI } from '@/features/kpiTable/graphql/queries'
import { KpiRow } from '@/features/kpiTable/graphql/types'
import { useQuery } from '@apollo/client/react'

export const useKpi = () => {
  const { variables, autoRefresh, setRequestTime } = useKpiContext()
  const startRef = useRef<number | null>(null)

  const {
    data,
    loading: loadingKpi,
    error: errorKpi,
  } = useQuery<{ kpi: KpiRow[] }>(GET_KPI, {
    variables,
    pollInterval: autoRefresh ? 5000 : 0,
    skip: !Object.keys(variables).length,
  })

  useEffect(() => {
    if (loadingKpi) {
      startRef.current = Date.now()
    } else if (startRef.current !== null) {
      setRequestTime(Date.now() - startRef.current)
      startRef.current = null
    }
  }, [loadingKpi])

  return { data: data?.kpi, loadingKpi, errorKpi, interval: variables.interval }
}
