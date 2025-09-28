import { GET_CURRENCIES } from '@/features/kpiTable/graphql/queries'
import { Currency } from '@/features/kpiTable/graphql/types'
import { useQuery } from '@apollo/client/react'

export const useCurrencies = () => {
  const { data: currencies, error: errorCurrencies } = useQuery<{ currencies: Currency[] }>(GET_CURRENCIES)

  return {
    currencies:
      currencies?.currencies.map((c) => ({ label: `${c.symbol} ${c.name} (${c.code})`, value: c.code })) || [],
    errorCurrencies,
  }
}
