import { Injectable } from '@nestjs/common';
import { EstadoVoto, Prisma, detalles_sufragio } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DestinoSufragioService {
  constructor(private readonly model: PrismaService) {}

  async create(
    destinoSufragioDTO: Prisma.detalles_sufragioCreateInput,
  ): Promise<detalles_sufragio> {
    return await this.model.detalles_sufragio.create({
      data: destinoSufragioDTO,
    });
  }

  async findAll(): Promise<detalles_sufragio[]> {
    return await this.model.detalles_sufragio.findMany({
      select: {
        id_detalle_sufragio: true,
        id_personas_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: true,
        jrv: {
          include: {
            centro_votacion: true
          }
        }
      },
    });
  }

  async findOne(id: number): Promise<detalles_sufragio> {
    return await this.model.detalles_sufragio.findUnique({
      where: {
        id_detalle_sufragio: id,
      },
      select: {
        id_detalle_sufragio: true,
        id_personas_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: true,
        jrv: {
          include: {
            centro_votacion: true
          }
        }
      }
    });
  }

  async update(
    id: number,
    centroVotacionDTO: Prisma.detalles_sufragioUpdateInput,
  ): Promise<detalles_sufragio> {
    return await this.model.detalles_sufragio.update({
      where: {
        id_detalle_sufragio: id,
      },
      data: centroVotacionDTO,
    });
  }

  async delete(id: number) {
    return await this.model.detalles_sufragio.delete({
      where: {
        id_detalle_sufragio: id,
      },
    });
  }

  async changeStatus(
    id: number,
    id_usuario: number
  ): Promise<any> {
    return await this.model.detalles_sufragio.update({
      
      where: {
        id_detalle_sufragio: id,
      },
      data: {
        estado_voto: EstadoVoto.EMITIDO,
        supervisado_por: id_usuario,
        asistio_en: new Date(),
      },
      select: {
        informacion_personal: true,
        jrv: {
          include: {
            centro_votacion: true
          }
        }
      }
    });
  }

  async findByDui(dui: string): Promise<any>{
    const persona = await this.model.personas_naturales.findUnique({
      where: {
        dui: dui
      }
    });

    return this.model.detalles_sufragio.findUnique({
      where: {
        id_personas_natural: persona.id_persona_natural
      },
      select: {
        id_detalle_sufragio: true,
        id_personas_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: true,
        jrv: {
          include: {
            centro_votacion: {
              include: {
                municipios: {
                  include: {
                    departamentos: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }
}
