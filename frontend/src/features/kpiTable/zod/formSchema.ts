import { intervals } from '@/features/kpiTable/constants'
import { z } from 'zod'

export const formSchema = z
  .object({
    from: z.date({
      error: (issue) => (issue.input === undefined ? 'Поле обязательно' : 'Неверный формат даты'),
    }),
    to: z.date({
      error: (issue) => (issue.input === undefined ? 'Поле обязательно' : 'Неверный формат даты'),
    }),
    interval: z.enum(
      intervals.map((i) => i.value),
      {
        error: () => ({ message: 'Поле обязательно' }),
      },
    ),
    currencies: z.array(z.string()).optional(),
  })
  .refine((data) => data.from < data.to, {
    message: 'Дата начала должна быть меньше даты конца периода',
    path: ['from'],
  })
