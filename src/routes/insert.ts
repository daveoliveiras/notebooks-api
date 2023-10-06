import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function insert(app: FastifyInstance){
  app.post('/notebook', async (request, reply) => {

    console.log(request.body)

    let bodySchema = z.object({
      id: z.number(),
      ram: z.number(),
      ddr: z.number(),
      hd: z.number().optional(),
      sdd: z.number().optional(),
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

      photos: z.array(z.string())
    })

    const notebook = bodySchema.parse(request.body)

    let brand = await prisma.brand.findFirst({
      where: {
        name: notebook.brand.name,
      }
    })

    if(!brand){
      brand = await prisma.brand.create({
        data:{
          name: notebook.brand.name
        }
      })
    }

    let system = await prisma.system.findFirst({
      where: {
        name: notebook.system.name,
        version: notebook.system.version
      }
    })

    if(!system){
      system = await prisma.system.create({
        data:{
          name: notebook.system.name,
          version: notebook.system.version
        }
      })
    }

    await prisma.notebook.create({
      data: {
        id: notebook.id,
        ram: notebook.ram,
        ddr: notebook.ddr,
        hd: notebook.hd,
        ssd: notebook.sdd,
        graphics_card: notebook.graphics_card,
        model: notebook.model,
        note: notebook.note,
        resolution: notebook.resolution,
        inch: notebook.inch,
        touch: notebook.touch,
        clock: notebook.clock,
        processor_brand: notebook.processor_brand,
        processor_model: notebook.processor_model,
        brandId: brand.id,
        systemId: system.id,
      }
    })

    notebook.photos.forEach(async (photo) => {
      await prisma.photo.create({
        data:{
          path: photo,
          notebookId: notebook.id
        }
      })
    })

    return reply.statusCode
  })
}