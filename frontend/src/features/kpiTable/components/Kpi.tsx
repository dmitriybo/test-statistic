'use client'

import { apolloClient } from '@/apollo/apolloClient'
import { KpiBlock } from '@/features/kpiTable/components/KpiBlock'
import { KpiForm } from '@/features/kpiTable/components/KpiForm'
import { KpiContextProvider } from '@/features/kpiTable/context/KpiContext'
import { ApolloProvider } from '@apollo/client/react'
import { Card } from '@radix-ui/themes'

export const Kpi = () => (
  <ApolloProvider client={apolloClient}>
    <Card>
      <KpiContextProvider>
        <KpiForm />
        <KpiBlock className="mt-5" />
      </KpiContextProvider>
    </Card>
  </ApolloProvider>
)
