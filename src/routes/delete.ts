import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function drop(app: FastifyInstance) {
  app.delete('/notebook/delete/:id', async (request, reply) => {

    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const idConverted = parseInt(id)

    await prisma.notebook.delete({
      where:{
        id: idConverted
      }
    })
  })
}