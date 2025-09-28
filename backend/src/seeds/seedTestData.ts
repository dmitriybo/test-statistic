import { Prisma, PrismaClient } from '@prisma/client'
import cuid from 'cuid'
import { subDays } from 'date-fns'

import { refreshKpiImmediately } from '../cron/refreshKpiImmediately'

const prisma = new PrismaClient()

const DEFAULT_USERS_COUNT = 200_000
const USERS_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : DEFAULT_USERS_COUNT
const DAYS = 365
const BATCH_SIZE = 10_000

// Генерация случайной даты за последние DAYS дней
function randomDate() {
  const start = subDays(new Date(), DAYS)
  const end = new Date()
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('Seeding database...')

  // Загружаем валюты
  const currencies = await prisma.currency.findMany()
  const currencyCodes = currencies.map((c) => c.code)
  if (currencyCodes.length === 0) {
    throw new Error('No currencies found. Run seedCurrencies.ts first.')
  }

  // Создаём пользователей
  const users: Prisma.UserCreateManyInput[] = []
  const userIds: string[] = []
  for (let i = 0; i < USERS_COUNT; i++) {
    const id = cuid()
    userIds.push(id)
    users.push({
      id,
      createdAt: randomDate(),
    })
  }

  console.log(`Creating ${USERS_COUNT} users...`)
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE)
    await prisma.user.createMany({ data: batch, skipDuplicates: true })
    console.log(`Inserted users ${i + 1}-${i + batch.length}. Total: ${users.length}`)
  }

  // Генерация logins, tries и deposits
  const logins: Prisma.LoginCreateManyInput[] = []
  const tries: Prisma.TryCreateManyInput[] = []
  const deposits: Prisma.DepositCreateManyInput[] = []

  for (const userId of userIds) {
    // Создаём хотя бы один первый login
    const firstLoginDate = randomDate()
    logins.push({
      eventId: cuid(),
      userId,
      createdAt: firstLoginDate,
    })

    // Повторные logins
    const repeatLoginCount = Math.random() < 0.6 ? randomInt(1, 5) : 0
    for (let i = 0; i < repeatLoginCount; i++) {
      const loginDate = randomDate()
      logins.push({
        eventId: cuid(),
        userId,
        createdAt: loginDate,
      })
    }

    // Try генерируем только если есть повторный login
    if (repeatLoginCount > 0) {
      const triesCount = randomInt(1, 5)
      for (let i = 0; i < triesCount; i++) {
        tries.push({
          eventId: cuid(),
          userId,
          createdAt: randomDate(),
          isFirst: i === 0,
        })
      }
    }

    // Генерация депозитов
    if (Math.random() < 0.4) {
      // 40% делают депозиты
      const fdDate = randomDate()
      const fdCurrency = randomChoice(currencyCodes)
      deposits.push({
        eventId: cuid(),
        userId,
        createdAt: fdDate,
        amount: new Prisma.Decimal(randomInt(10, 200)),
        currencyCode: fdCurrency,
        isFirst: true,
      })

      // Повторные депозиты (RD)
      const rdCount = Math.random() < 0.5 ? randomInt(1, 5) : 0
      for (let i = 0; i < rdCount; i++) {
        deposits.push({
          eventId: cuid(),
          userId,
          createdAt: randomDate(),
          amount: new Prisma.Decimal(randomInt(5, 150)),
          currencyCode: fdCurrency,
          isFirst: false,
        })
      }
    }
  }

  // Вставка батчами
  const insertBatches = async <T>(arr: T[], fn: (data: T[]) => Promise<void>, label: string) => {
    for (let i = 0; i < arr.length; i += BATCH_SIZE) {
      const batch = arr.slice(i, i + BATCH_SIZE)
      await fn(batch)
      console.log(`Inserted ${label} ${i + 1}-${i + batch.length}. Total: ${arr.length}`)
    }
  }

  await insertBatches(
    logins,
    async (batch) => {
      await prisma.login.createMany({ data: batch, skipDuplicates: true })
    },
    'logins',
  )
  await insertBatches(
    tries,
    async (batch) => {
      await prisma.try.createMany({ data: batch, skipDuplicates: true })
    },
    'tries',
  )
  await insertBatches(
    deposits,
    async (batch) => {
      await prisma.deposit.createMany({ data: batch, skipDuplicates: true })
    },
    'deposits',
  )

  // Удаляем на случай, если во время сидинга были вставлены данные (год + час)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  oneYearAgo.setHours(oneYearAgo.getHours() - 1)

  await prisma.kpiHourlyAgg.deleteMany({
    where: {
      bucketStart: {
        gte: oneYearAgo,
      },
    },
  })

  await refreshKpiImmediately()

  console.log('Seeding completed!')
  console.log('Open http://localhost:3000/')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
