import { prisma } from '../../config/prisma/prisma'

export class CurrencyService {
  static async getAllCurrencies() {
    return prisma.currency.findMany()
  }
}
