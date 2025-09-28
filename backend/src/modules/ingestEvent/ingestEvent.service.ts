import { prisma } from '../../config/prisma/prisma'
import { IngestEventType } from './constants'

export class IngestEventService {
  static async ingestEvent(userId: string, event: { type: IngestEventType; eventId: string }) {
    try {
      if (event.type === 'LOGIN') {
        await prisma.login.upsert({
          where: { eventId: event.eventId },
          update: {},
          create: { eventId: event.eventId, userId },
        })
        return { success: true, message: 'Login event ingested', eventId: event.eventId }
      } else if (event.type === 'TRY') {
        // Не учитываем первый логин
        const loginCount = await prisma.login.count({ where: { userId } })
        if (loginCount < 2) {
          return { success: false, message: 'User must have at least 2 logins', eventId: event.eventId }
        }

        // Проверяем, была ли уже попытка для этого пользователя
        const existingTryCount = await prisma.try.count({ where: { userId } })
        const isFirst = existingTryCount === 0

        await prisma.try.upsert({
          where: { eventId: event.eventId },
          update: {},
          create: { eventId: event.eventId, userId, isFirst },
        })

        return { success: true, message: 'Try event ingested', eventId: event.eventId }
      } else {
        return { success: false, message: 'Unknown event type', eventId: event.eventId }
      }
    } catch (error: any) {
      return { success: false, message: error.message, eventId: event.eventId }
    }
  }
}
