import { FastifyInstance } from 'fastify'
import { S3Client } from '@aws-sdk/client-s3'
import { z } from 'zod'
import multer from 'fastify-multer'
import multerS3 from 'multer-s3'
import jwt_decode from 'jwt-decode'

let name: string
let paths: string[] = []

const user = z.object({
  sub: z.string(),
})

const requestHeaders = z.object({
  id: z.string(),
  raw: z.object({
    rawHeaders: z.array(z.string())      
  })
})

const s3 = multerS3({
  s3: new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,      
    }
  }),
  bucket: 'notebooks-fastify',
  acl: 'public-read',
  key: function (request, file, callback) {
    const authorization  = requestHeaders.parse(request)
    const token = authorization.raw.rawHeaders[7].substring(7)
    // console.log(isJwtTokenExpired(token)) https://www.npmjs.com/package/jwt-check-expiry
    const decodedToken = jwt_decode(token)
    const userIdDecoded = user.parse(decodedToken)

    name = Date.now().toString()
    file.mimetype.includes('png') ? name = name + '.png' : name = name + '.jpg'    
    paths.push(userIdDecoded.sub + '/' + name)
    callback(null, userIdDecoded.sub + '/' + name)
  }
})

const upload = multer({storage: s3}) // Express vs. Fastify (TypeScript) but it works

export async function photos(app: FastifyInstance) {
  app.register(multer.contentParser)
  app.post('/upload', { preHandler: upload.array('photo')}, async (request, reply) => {
    await request.jwtVerify()
    reply.send(paths)
    paths = []
  })
}
