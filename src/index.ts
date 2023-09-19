import fastify from 'fastify'
import { insert } from './routes/insert'
import { getAll } from './routes/get-all'

const port = 80
const app = fastify()
app.register(insert)
app.register(getAll)

app.get('/', (request, reply) => {
  return 'hm'
})

app.listen({ port: port}, () => {
  console.log('running => http://localhost')
})