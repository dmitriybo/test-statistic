import { CurrencyService } from '../currency.service'

export const currenciesResolvers = {
  Query: {
    currencies: async (_: any, _args: any) => CurrencyService.getAllCurrencies(),
  },
}
