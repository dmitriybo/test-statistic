import { FC, memo, useRef } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { KpiRow } from '@/features/kpiTable/graphql/types'
import { formatDate } from '@/lib/formatDate'
import { useVirtualizer } from '@tanstack/react-virtual'

interface KpiTableProps {
  className?: string
  data?: KpiRow[]
  interval?: string
  loadingKpi?: boolean
}

export const KpiTable: FC<KpiTableProps> = memo(({ className, data = [], interval, loadingKpi }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 37,
    overscan: 25,
  })

  return (
    <div className={className} style={{ transform: 'translate(0)' }}>
      <div className="overflow-auto" ref={parentRef} style={{ height: 'calc(100vh - 190px)' }}>
        <Table className="relative" style={{ overflow: 'hidden' }}>
          <TableHeader className="fixed bg-background top-0 z-10" style={{ width: 'calc(100% - 15px)' }}>
            <TableRow
              style={{ display: 'grid', gridTemplateColumns: 'minmax(135px, 1fr) repeat(8, 1fr)', height: '40px' }}
            >
              <TableHead className="flex items-center">Начало периода</TableHead>
              <TableHead className="flex items-center">Reg2Try</TableHead>
              <TableHead className="flex items-center">Reg2Dep</TableHead>
              <TableHead className="flex items-center">FD count</TableHead>
              <TableHead className="flex items-center">Avg FD</TableHead>
              <TableHead className="flex items-center">RD/FD</TableHead>
              <TableHead className="flex items-center">Try2RD</TableHead>
              <TableHead className="flex items-center">Average RD</TableHead>
              <TableHead className="flex items-center">Average Deposit</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody
            style={{
              position: 'relative',
              height: `${rowVirtualizer.getTotalSize() + 40}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = data[virtualRow.index]
              return (
                <TableRow
                  key={row.bucketStart}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start + 40}px)`,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(135px, 1fr) repeat(8, 1fr)',
                  }}
                >
                  <TableCell className="font-medium">{formatDate(row.bucketStart, interval!)}</TableCell>
                  <TableCell>{row.reg2Try}%</TableCell>
                  <TableCell>{row.reg2Dep}%</TableCell>
                  <TableCell>{row.firstDepositCount}</TableCell>
                  <TableCell>{row.avgFD}</TableCell>
                  <TableCell>{row.rdPerFd}</TableCell>
                  <TableCell>{row.try2Rd}%</TableCell>
                  <TableCell>{row.avgRD}</TableCell>
                  <TableCell>{row.avgDeposit}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {!data.length && !loadingKpi && (
          <p className="text-center text-sm pt-20 pb-10 text-muted-foreground">Нет данных</p>
        )}
        {!data.length && loadingKpi && (
          <p className="text-center text-sm pt-20 pb-10 text-muted-foreground">Загрузка...</p>
        )}
      </div>
    </div>
  )
})
