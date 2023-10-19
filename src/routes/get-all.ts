import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function getAll(app: FastifyInstance){

  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/notebook', async (request, reply) => {

    const notebooks = await prisma.notebook.findMany({
      where: {
        userUid: request.user.sub
      },
      include: {
        brand: {
          select: {
            name: true
          }
        },
        system: {
          select: {
            name: true,
            version: true
          }
        },
        photos: {
          select: {
            path: true
          }
        }     
      }
    })

    reply.send(notebooks)
  })
}
