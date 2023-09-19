import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function getById(app:FastifyInstance) {
  app.get('/notebook/:id', async (request, reply) => {
    
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const idConverted = parseInt(id)

    const note = await prisma.notebook.findUnique({
      where:{
        id: idConverted
      },
      include:{
        photos:{
          select:{
            path: true
          }
        },
        brand: {
          select:{
            name: true
          }
        },
        system: {
          select:{
            name: true,
            version: true
          }
        }
      }
    })

    reply.send(note)
  })
}