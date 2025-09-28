import { mergeResolvers } from '@graphql-tools/merge'

import { currenciesResolvers } from '../../modules/currencies/graphql/currencies.resolvers'
import { ingestEventResolvers } from '../../modules/ingestEvent/graphql/ingestEvent.resolvers'
import { kpiResolvers } from '../../modules/kpi/graphql/kpi.resolvers'

export const resolvers = mergeResolvers([kpiResolvers, currenciesResolvers, ingestEventResolvers])
