import { ApolloServer } from 'apollo-server'
import dotenv from 'dotenv'

import { context } from './config/graphql/context'
import { schema } from './config/graphql/schema'

dotenv.config()

const server = new ApolloServer({
  schema,
  context,
})

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
