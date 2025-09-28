import { IngestEventType } from '../constants'
import { IngestEventService } from '../ingestEvent.service'

export const ingestEventResolvers = {
  Mutation: {
    ingestEvent: async (
      _: any,
      { event }: { event: { type: IngestEventType; eventId: string; createdAt?: string } },
      context: any,
    ) => {
      // userId берём из access_token
      const userId = context.user?.id
      if (!userId) {
        return { success: false, message: 'Unauthorized', eventId: event.eventId }
      }

      return IngestEventService.ingestEvent(userId, event)
    },
  },
}
