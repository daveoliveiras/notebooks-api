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
  bucket: 'notebooks-project',
  acl: 'public-read',
  key: function (request, file, callback) {

    let token = ''

    const authorization  = requestHeaders.parse(request)
    for(let i = 1; i<20; i++){
      if(authorization.rawHeaders[i].indexOf('Bearer') != -1){
        token = authorization.rawHeaders[i].substring(7)
        i=30
      }
      else
        i++
    } 
    
    if(token){

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
  }
})

const upload = multer({storage: s3})

const expressApp = express()

expressApp.post('/upload-images', upload.array('photo'), (request, response) => {

  response.send(paths)
  console.log(paths)
  paths = []
})

export { expressApp }
