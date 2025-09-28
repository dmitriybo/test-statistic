import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

const KpiContext = createContext<KpiContextType>(null as unknown as KpiContextType)

interface Variables {
  from?: string
  to?: string
  interval?: string
  currencies?: string[]
}
type KpiContextType = {
  variables: Variables
  setVariables: (variables: Variables) => void
  autoRefresh: boolean
  setAutoRefresh: (autoRefresh: boolean) => void
  requestTime: number | null
  setRequestTime: (requestTime: number | null) => void
}

export const useKpiContext = () => useContext(KpiContext)

export const KpiContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [variables, setVariables] = useState({})
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [requestTime, setRequestTime] = useState<number | null>(null)

  return (
    <KpiContext.Provider value={{ variables, setVariables, autoRefresh, setAutoRefresh, requestTime, setRequestTime }}>
      {children}
    </KpiContext.Provider>
  )
}
