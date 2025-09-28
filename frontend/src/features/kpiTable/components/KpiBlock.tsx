import { FC } from 'react'

import { KpiTable } from '@/features/kpiTable/components/KpiTable'
import { useKpi } from '@/features/kpiTable/hooks/useKpi'

interface KpiBlockProps {
  className?: string
}

export const KpiBlock: FC<KpiBlockProps> = ({ className }) => {
  const { data, interval, loadingKpi } = useKpi()

  return <KpiTable className={className} data={data} interval={interval} loadingKpi={loadingKpi} />
}
