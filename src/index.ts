import { insert } from './routes/insert'
import { getAll } from './routes/get-all'
import { drop } from './routes/delete'
import { getById } from './routes/get-by-id'
import { auth } from './routes/auth'
import { expressUpload } from './routes/express-upload'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifyExpress from '@fastify/express'

const port = 3333
const app = fastify()
const cors = ['http://192.168.15.50:5173', 'http://localhost:5173']

app.register(fastifyCors, {origin: cors})
app.register(jwt, {
  secret: 'secretgarden'
})
app.register(fastifyExpress).after(() => {
  app.use(expressUpload)
})

app.register(insert)
app.register(getAll)
app.register(drop)
app.register(getById)
// app.register(photos) deprecated
app.register(auth)

app.listen({ port: port, host: '0.0.0.0'}, () => {
  console.log('server => http://192.168.15.50:3333')
})
