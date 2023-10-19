import { Injectable } from '@nestjs/common';
import { EstadoVoto, Prisma, detalles_sufragio } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
const { v4: uuidv4 } = require('uuid');
const date = require('date-and-time');

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

  async findAll(): Promise<any> {
    return await this.model.detalles_sufragio.findMany({
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        uuid_info: true,
        ledger_id: true,
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
        uuid_info: true,
        ledger_id: true,
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

  async findOneByIdPersonaNatural(id_persona_natural: number): Promise<any> {
    return await this.model.detalles_sufragio.findFirst({
      where: {
        id_persona_natural: id_persona_natural,
      },
      select: {
        id_detalle_sufragio: true,
        id_persona_natural: true,
        id_jrv: true,
        uuid_info: true,
        ledger_id: true,
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
        uuid_info: true,
        ledger_id: true,
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

  async crearVoto(
    id_detalle_sufragio: number,
    genero: string,
    departamento: string,
    municipio: string,
    dui: string,
    codigo: string,
  ): Promise<any> {
    const claves = `${codigo}${dui}${municipio}${departamento}${genero}${id_detalle_sufragio}`;
    const uuid = uuidv4(claves);

    const crearVoto = await fetch(`${process.env.QLDB_URL}/sufragios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        codigo: codigo,
        dui: dui,
        departamento: departamento,
        municipio: municipio,
        sexo: genero,
        uuid: uuid,
      }),
    }).then((res) => res.json());

    const actualizarEstado = await this.model.detalles_sufragio.update({
      where: {
        id_detalle_sufragio: id_detalle_sufragio,
      },
      data: {
        estado_voto: 'SIN_EMITIR',
        ledger_id: crearVoto.sufragioId,
        uuid_info: uuid,
      },
    });

    return actualizarEstado;
  }

  async verificarVoto(ledger_id: string): Promise<any> {
    const verificarEstadoVoto = await fetch(
      `${process.env.QLDB_URL}/historial/${ledger_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    ).then((res) => res.json());

    return verificarEstadoVoto;
  }

  async validarVoto(ledger_id: string, id_detalle_sufragio: number) {
    const validarVoto = await fetch(`${process.env.QLDB_URL}/verificar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        sufragioId: ledger_id,
      }),
    }).then((res) => res.json());

    const actualizarEstado = await this.model.detalles_sufragio.update({
      where: {
        id_detalle_sufragio: id_detalle_sufragio,
      },
      data: {
        estado_voto: 'VALIDADO',
      },
    });

    return validarVoto;
  }

  async emitirVoto(
    ledger_id: string,
    candidato_id: number,
    id_detalle_sufragio: number,
  ) {
    const emitirVoto = await fetch(`${process.env.QLDB_URL}/ejecutar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        sufragioId: ledger_id,
        votoId: candidato_id,
      }),
    }).then((res) => res.json());

    const verificarEstadoVoto = await this.verificarVoto(ledger_id);
    let lastIndex = verificarEstadoVoto.length - 1;
    console.log(verificarEstadoVoto[lastIndex]);
    
    const guardarVoto = await this.model.sufragios.create({
      data: {
        codigo: verificarEstadoVoto[lastIndex].data.codigo,
        departamento: verificarEstadoVoto[lastIndex].data.departamento,
        municipio: verificarEstadoVoto[lastIndex].data.municipio,
        ledger_id: ledger_id,
        genero: verificarEstadoVoto[lastIndex].data.sexo,
        id_voto: verificarEstadoVoto[lastIndex].data.votoId ,
      }
    })

    const actualizarEstado = await this.model.detalles_sufragio.update({
      where: {
        id_detalle_sufragio: id_detalle_sufragio,
      },
      data: {
        estado_voto: 'EMITIDO',
        ledger_id: null,
      },
    });

    return actualizarEstado;
  }
}
