import { Injectable } from '@nestjs/common';
import { EstadoVoto, Prisma, detalles_sufragio } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DestinoSufragioService {
  constructor(private readonly model: PrismaService) {}

  async create(
    destinoSufragioDTO: Prisma.detalles_sufragioCreateInput,
  ): Promise<detalles_sufragio> {
    console.log(destinoSufragioDTO);

    return await this.model.detalles_sufragio.create({
      data: destinoSufragioDTO,
    });
  }

  async findAll(): Promise<any> {
    return await this.model.detalles_sufragio.findMany({
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: {
          include: {
            municipio: {
              include: {
                departamentos: true,
              },
            },
          },
        },
        jrv: {
          include: {
            centro_votacion: {
              include: {
                municipios: {
                  include: {
                    departamentos: true,
                  },
                },
              },
            },
          },
        },
        supervisadoPor: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                id_rol: true,
                nombres: true,
                apellidos: true,
                dui: true,
                usuario: true,
                estado: true,
                creado_en: true,
                modificado_en: true,
                Rol: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<any> {
    return await this.model.detalles_sufragio.findUnique({
      where: {
        id_detalle_sufragio: id,
      },
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: {
          include: {
            municipio: {
              include: {
                departamentos: true,
              },
            },
          },
        },
        jrv: {
          include: {
            centro_votacion: {
              include: {
                municipios: {
                  include: {
                    departamentos: true,
                  },
                },
              },
            },
          },
        },
        supervisadoPor: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                id_rol: true,
                nombres: true,
                apellidos: true,
                dui: true,
                usuario: true,
                estado: true,
                creado_en: true,
                modificado_en: true,
                Rol: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneByIdPersonaNatural(id: number): Promise<any> {
    return await this.model.detalles_sufragio.findFirst({
      where: {
        id_persona_natural: id,
      },
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: {
          include: {
            municipio: {
              include: {
                departamentos: true,
              },
            },
          },
        },
        jrv: {
          include: {
            centro_votacion: {
              include: {
                municipios: {
                  include: {
                    departamentos: true,
                  },
                },
              },
            },
          },
        },
        supervisadoPor: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                id_rol: true,
                nombres: true,
                apellidos: true,
                dui: true,
                usuario: true,
                estado: true,
                creado_en: true,
                modificado_en: true,
                Rol: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: number) {
    return await this.model.detalles_sufragio.delete({
      where: {
        id_detalle_sufragio: id,
      },
    });
  }

  async changeStatus(id: number, id_usuario: number): Promise<any> {
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
            centro_votacion: true,
          },
        },
      },
    });
  }

  async findByDui(dui: string): Promise<any> {
    const persona = await this.model.personas_naturales.findUnique({
      where: {
        dui: dui,
      },
    });

    return this.model.detalles_sufragio.findFirst({
      where: {
        id_persona_natural: persona.id_persona_natural,
      },
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        supervisado_por: true,
        asistio_en: true,
        estado_voto: true,
        creado_en: true,
        modificado_en: true,
        informacion_personal: {
          include: {
            municipio: {
              include: {
                departamentos: true,
              },
            },
          },
        },
        jrv: {
          include: {
            centro_votacion: {
              include: {
                municipios: {
                  include: {
                    departamentos: true,
                  },
                },
              },
            },
          },
        },
        supervisadoPor: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                id_rol: true,
                nombres: true,
                apellidos: true,
                dui: true,
                usuario: true,
                estado: true,
                creado_en: true,
                modificado_en: true,
                Rol: true
              },
            },
          },
        },
      },
    });
  }
}
