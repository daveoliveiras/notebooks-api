import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod'

export async function insert(app: FastifyInstance){
  app.post('/notebook/insert', async (request, reply) => {

    let bodySchema = z.object({
      id: z.number(),
      ram: z.number(),
      ddr: z.number(),
      hd: z.number().optional(),
      ssd: z.number().optional(),
      graphics_card: z.string().optional(),
      model: z.string(),
      note: z.string().optional(),
      resolution: z.string(),
      inch: z.null(),
      touch: z.boolean(),
      clock: z.number(),
      processor_brand: z.string(),
      processor_model: z.string(),
    
      system: z.object({
        name: z.string(),
        version: z.number()
      }),
    
      brand: z.object({
        name: z.string()
      }),

    })

    const notebook = bodySchema.parse(request.body)

    const brand = await prisma.brand.findFirst({
      where: {
        name: notebook.brand.name,
      }
    })

    const system = await prisma.system.findFirst({
      where: {
        name: notebook.system.name,
        version: notebook.system.version
      }
    })

    
    await  prisma.notebook.create({
        data: {
          id: notebook.id,
          ram: notebook.ram,
          ddr: notebook.ddr,
          hd: notebook.hd,
          ssd: notebook.ssd,
          graphics_card: notebook.graphics_card,
          model: notebook.model,
          note: notebook.note,
          resolution: notebook.resolution,
          inch: notebook.inch,
          touch: notebook.touch,
          clock: notebook.clock,
          processor_brand: notebook.processor_brand,
          processor_model: notebook.processor_model,
          brandId: 1,
          systemId: 1,
          photos: {
            create:{
              id: 33,
              path: '33'
            }
          }
        }
      })
    // }  

    reply.send([system, brand])
    console.log(system)    
  })
}