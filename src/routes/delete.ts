import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { clientAmazon } from '../lib/s3'
import { z } from 'zod'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3'

export async function drop(app: FastifyInstance) {
  app.delete('/notebook/delete/:id', async (request, reply) => {

    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const idConverted = parseInt(id)

    const notebook = await prisma.notebook.findUnique({
      where: {
        id: idConverted
      },
      include: {
        photos: true
      }
    })

    const paths = notebook?.photos

    type myObjectType = {
      Key: string
    }

    let objects: myObjectType[] = []

    paths?.forEach((item) => {
      objects.push({Key: item.path})
    })

    const input = {
      Bucket: 'notebooks-fastify',
      Delete: {
        Objects: objects
      } 
    }

    console.log(objects)
    const command = new DeleteObjectsCommand(input)
    const response = await clientAmazon.send(command)
    console.log(response)
    
    await prisma.notebook.delete({
      where:{
        id: idConverted
      }
    }).catch((error) => {
      reply.status(400).send(error.meta.cause)
    })   

  })
}
