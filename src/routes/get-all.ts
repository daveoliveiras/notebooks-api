import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma'

export async function getAll(app: FastifyInstance){
  app.get('/notebook/get-all', async (request, reply) => {

    const notebooks = await prisma.notebook.findMany({
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

    console.log(notebooks)
    reply.send(notebooks)
  })
}