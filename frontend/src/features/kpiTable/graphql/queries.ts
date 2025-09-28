import { gql } from '@apollo/client'

export const GET_CURRENCIES = gql`
  query GetCurrencies {
    currencies {
      code
      name
      symbol
    }
  }
`

export const GET_KPI = gql`
  query GetKpi($from: DateTime!, $to: DateTime!, $interval: Interval!, $timezone: String, $currencies: [String!]) {
    kpi(from: $from, to: $to, interval: $interval, timezone: $timezone, currencies: $currencies) {
      bucketStart
      firstDepositCount
      reg2Try
      reg2Dep
      avgFD
      rdPerFd
      try2Rd
      avgRD
      avgDeposit
    }
  }
`
