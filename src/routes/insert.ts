import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function insert(app: FastifyInstance){
  app.post('/notebook', async (request, reply) => {

    await request.jwtVerify()

    let bodySchema = z.object({
      id: z.number(),

      brand: z.object({
        name: z.string()
      }),

      model: z.string(),

      system: z.object({
        name: z.string(),
        version: z.string()
      }),
    
      processor_brand: z.string(),
      processor_model: z.string(),  
      clock: z.number(),

      hd: z.number().optional(),
      sdd: z.number().optional(),
      ram: z.number(),
      ddr: z.number(),

      video: z.string().optional(),
      resolution: z.string(),
      inch: z.null(),
      touch: z.boolean(),
      
      note: z.string().optional(),
      photos: z.array(z.string())
    })

    const notebook = bodySchema.parse(request.body)

    let noteAlreadyExists = await prisma.notebook.findUnique({
      where: {
        id: notebook.id
      }
    })

    if(noteAlreadyExists){
      reply.status(400).send('Já existe um notebook com esse identificador.')
      return
    }

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
        userUid: request.user.sub,
        brandId: brand.id,
        model: notebook.model,
        systemId: system.id,
        processor_brand: notebook.processor_brand,
        processor_model: notebook.processor_model,
        clock: notebook.clock,
        hd: notebook.hd,
        ssd: notebook.sdd,
        ram: notebook.ram,
        ddr: notebook.ddr,
        video: notebook.video,
        resolution: notebook.resolution,
        inch: notebook.inch,
        touch: notebook.touch,
        note: notebook.note,        
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
