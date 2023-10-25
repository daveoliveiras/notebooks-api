import { S3Client } from '@aws-sdk/client-s3'
import { z } from 'zod'
import { clientAmazon } from '../lib/s3'
import express from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import jwt_decode from 'jwt-decode'
import isJwtTokenExpired from 'jwt-check-expiry'

let name: string
let paths: string[] = []

const user = z.object({
  sub: z.string(),
})

const requestHeaders = z.object({
  rawHeaders: z.array(z.string())
})

const s3 = multerS3({
  s3: clientAmazon,
  bucket: 'notebooks-fastify',
  acl: 'public-read',
  key: function (request, file, callback) {

    const authorization  = requestHeaders.parse(request)
    const token = authorization.rawHeaders[7].substring(7)

    if(!isJwtTokenExpired(token)){
      const decodedToken = jwt_decode(token)
      const userIdDecoded = user.parse(decodedToken)

      name = Date.now().toString()
      file.mimetype.includes('png') ? name = name + '.png' : name = name + '.jpg'    
      paths.push(userIdDecoded.sub + '/' + name)
      callback(null, userIdDecoded.sub + '/' + name)
    }else{
      callback('Invalid token')
    }
  }
})

const upload = multer({storage: s3})

const expressUpload = express()

expressUpload.post('/express-upload', upload.array('photo'), (request, response) => {
  response.send(paths)
  paths = []
})

export { expressUpload }
