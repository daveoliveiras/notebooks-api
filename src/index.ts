import fastify from 'fastify'
import { insert } from './routes/insert'
import { getAll } from './routes/get-all'
import { drop } from './routes/delete'
import { getById } from './routes/get-by-id'
import fastifyCors from '@fastify/cors'
import { uploadImages } from './routes/uploadImages'

const port = 3333
const app = fastify()

app.register(fastifyCors, {origin: 'http://192.168.15.50:5173'})

app.register(insert)
app.register(getAll)
app.register(drop)
app.register(getById)
app.register(uploadImages)

app.listen({ port: port, host: '0.0.0.0'}, () => {
  console.log('running => http://192.168.15.50:3333')
})