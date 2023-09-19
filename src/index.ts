import fastify from 'fastify'
import { insert } from './routes/insert'
import { getAll } from './routes/get-all'
import { drop } from './routes/delete'
import { getById } from './routes/get-by-id'
import fastifyCors from '@fastify/cors'

const port = 3333
const app = fastify()

app.register(fastifyCors, {origin: 'http://localhost:5173'})
app.register(insert)
app.register(getAll)
app.register(drop)
app.register(getById)

app.listen({ port: port}, () => {
  console.log('running => http://localhost:3333')
})