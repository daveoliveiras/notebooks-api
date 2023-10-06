import { FastifyInstance } from 'fastify'
import { S3Client } from '@aws-sdk/client-s3'
import multer from 'fastify-multer'
import multerS3 from 'multer-s3'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'

let name: string
let path: string[] = []

const s3 = multerS3({
  s3: new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: 'AKIAVFVU4ADXZKPKSPAY',
      secretAccessKey: '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',      
    }
  }),
  bucket: 'notebooks-fastify',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: function (request, file, callback) {
    name = Date.now().toString()
    // console.log(randomUUID())
    path.push(name)
    callback(null, name)
  }
})

const upload = multer({storage: s3})

export async function uploadImages(app: FastifyInstance) {
  app.register(multer.contentParser)
  app.post('/upload', { preHandler: upload.fields([{name: 'photo'}, {name: 'teste'}])}, (request, reply) => {
    // reply.send('https://notebooks-fastify.s3.us-east-2.amazonaws.com/' + path[1])
    // console.log(request.body)
    reply.send(path)
    path = []
  })
}