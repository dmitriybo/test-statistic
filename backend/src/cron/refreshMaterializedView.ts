import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function refreshMaterializedView(view: string) {
  console.log(`[${new Date().toISOString()}] Refreshing ${view}...`)

  try {
    await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`)
    console.log(`[${new Date().toISOString()}] ${view} refreshed successfully.`)
  } catch (err: any) {
    if (err.message.includes('populated')) {
      await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW ${view}`)
      console.log(`[${new Date().toISOString()}] ${view} refreshed successfully.`)
    } else {
      console.error(`[${new Date().toISOString()}] Error refreshing ${view}:`, err)
    }
  }
}
