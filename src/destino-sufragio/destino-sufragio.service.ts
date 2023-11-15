import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EstadoVoto,
  Prisma,
  detalles_sufragio,
  sufragios,
} from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { io, Socket } from 'socket.io-client';
const { v4: uuidv4 } = require('uuid');
const date = require('date-and-time');

@Injectable()
export class DestinoSufragioService {
  public socketClient: Socket;
  constructor(private readonly model: PrismaService) {
    this.socketClient = io(`${process.env.IP}`);
  }

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
      },
    });
  }

  async findAllSufragios(): Promise<any> {
    let votos = [];
    for (let i = 1; i < 4; i++) {
      let objetoVoto = await this.obtenerVotos(i);
      if(objetoVoto == null){
        continue
      }
      votos.push(objetoVoto)
    }
    
    this.socketClient.emit('votes-bands', votos);
    return votos;
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
    console.log('EN EMITIR');

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
    const lastIndex = verificarEstadoVoto.length - 1;

    const guardarVoto = await this.model.sufragios.create({
      data: {
        codigo: verificarEstadoVoto[lastIndex].data.codigo,
        departamento: `${verificarEstadoVoto[lastIndex].data.departamento}`,
        municipio: `${verificarEstadoVoto[lastIndex].data.municipio}`,
        ledger_id: ledger_id,
        genero: verificarEstadoVoto[lastIndex].data.sexo,
        id_voto: verificarEstadoVoto[lastIndex].data.votoId,
      },
    });

    const actualizarEstado = await this.model.detalles_sufragio.update({
      where: {
        id_detalle_sufragio: id_detalle_sufragio,
      },
      data: {
        estado_voto: 'EMITIDO',
        ledger_id: null,
      },
    });
    this.findAllSufragios();
    return actualizarEstado;
  }

  async obtenerVotos(id_partido: number): Promise<any> {
    const departamentos = [
      'AHUACHAPAN',
      'SANTA ANA',
      'SONSONATE',
      'CHALATENANGO',
      'LA LIBERTAD',
      'SAN SALVADOR',
      'CUSCATLAN',
      'LA PAZ',
      'CABAÑAS',
      'SAN VICENTE',
      'USULUTAN',
      'SAN MIGUEL',
      'MORAZAN',
      'LA UNION',
    ];

    const informacion_partidos = await this.model.sufragios.findFirst({
      select: {
        partidos: {
          select: {
            id_partido_politico: true,
            nombre: true,
            siglas: true,
            logo: true,
            candidatos: {
              select: {
                informacion_personal: {
                  select: {
                    nombres: true,
                    apellidos: true,
                  },
                },
                foto_candidato: true,
                rol: true,
              },
            },
          },
        },
      },
      where: {
        id_voto: id_partido,
      },
    });

    if(!informacion_partidos){
      return;
    }

    const conteosPICHEgen = this.model.sufragios.groupBy({
      by: ['genero'],
      _count: {
        id_voto: true,
      },
      where: {
        id_voto: id_partido,
      },
    });

    const conteosPICHEdep = this.model.sufragios.groupBy({
      by: ['departamento'],
      _count: {
        id_voto: true,
      },
      where: {
        id_voto: id_partido,
      },
    });
    const [conteosPICHEGenero, conteosPICHEDepartamento] = await Promise.all([
      conteosPICHEgen,
      conteosPICHEdep,
    ]);

    let masculino = 0;
    let femenino = 0;
    conteosPICHEGenero.forEach((element) => {
      if (element.genero === 'M') {
        masculino = element._count.id_voto;
      } else if (element.genero === 'F') {
        femenino = element._count.id_voto;
      }
    });

    let departamentosCount = [];
    conteosPICHEDepartamento.forEach((elemento) => {
      departamentosCount.push({
        nombre: departamentos[Number(elemento.departamento) - 1],
        _count: elemento._count.id_voto,
      });
    });

    let countGeneral = await this.model.sufragios.count({
      where: {
        id_voto: id_partido,
      },
    });

    let candidatosInfo = [];
    informacion_partidos.partidos.candidatos.forEach((elemento) => {
      candidatosInfo.push({
        nombre: `${elemento.informacion_personal.nombres} ${elemento.informacion_personal.apellidos}`,
        foto: `https://evotes-app-administracion.s3.us-west-2.amazonaws.com/${elemento.foto_candidato}`,
        rol: `${elemento.rol}`,
      });
    });

    const newObject = {
      id_partido: informacion_partidos.partidos.id_partido_politico,
      nombre: informacion_partidos.partidos.nombre,
      siglas: informacion_partidos.partidos.siglas,
      logo: `https://evotes-app-administracion.s3.us-west-2.amazonaws.com/${informacion_partidos.partidos.logo}`,
      candidatos: candidatosInfo,
      genero: {
        masculino,
        femenino,
      },
      departamento: departamentosCount,
      _count: countGeneral,
    };

    return newObject;
  }
}
