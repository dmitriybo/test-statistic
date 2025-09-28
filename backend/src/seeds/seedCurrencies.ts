import { Currency, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
]

async function main() {
  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }
  console.log('Currencies seeded!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
