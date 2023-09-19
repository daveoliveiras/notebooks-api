import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function getAll(app: FastifyInstance){
  app.get('/notebook', async (request, reply) => {

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

    reply.send(notebooks).headers({ 'Access-Control-Allow-Origin': 'http://localhost:3000'})
  })
}