import { GraphQLScalarType, Kind } from 'graphql'

import { KpiService } from '../kpi.service'
import { KpiArgs } from '../types'

export const kpiResolvers = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    parseValue: (value) => {
      if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        return new Date(value)
      }
      throw new Error('Invalid DateTime input')
    },
    serialize: (value: unknown) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value).toISOString()
      }
      throw new Error('Invalid DateTime value')
    },
    parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null),
  }),

  Query: {
    kpi: async (_: any, args: KpiArgs) => KpiService.getKpiStats(args),
  },
}
