import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DestinoSufragioMSG } from 'src/common/constantes';
import { DestinoSufragioService } from './destino-sufragio.service';

@Controller()
export class DestinoSufragioController {
  constructor(
    private readonly DestinoSufragioService: DestinoSufragioService,
  ) {}

  @MessagePattern(DestinoSufragioMSG.CREATE)
  async create(@Payload() payload: any) {
    return await this.DestinoSufragioService.create(payload);
  }

  @MessagePattern(DestinoSufragioMSG.FIND_ALL)
  async findAll() {
    return this.DestinoSufragioService.findAll();
  }

  @MessagePattern(DestinoSufragioMSG.FIND_ONE)
  async findOne(@Payload() id: number) {
    return this.DestinoSufragioService.findOne(id);
  }

  @MessagePattern(DestinoSufragioMSG.FIND_BY_PERSONA_NATURAL)
  async findOneByIdPersonaNatural(@Payload() payload: any) {
    return this.DestinoSufragioService.findOneByIdPersonaNatural(
      payload.id_persona_natural,
    );
  }

  @MessagePattern(DestinoSufragioMSG.DELETE)
  async delete(@Payload() id: number) {
    return this.DestinoSufragioService.delete(id);
  }

  @MessagePattern(DestinoSufragioMSG.FIND_BY_DUI)
  async findByDui(@Payload() payload: any) {
    return await this.DestinoSufragioService.findByDui(payload);
  }

  @MessagePattern(DestinoSufragioMSG.CREATE_VOTE)
  async crearVoto(@Payload() payload: any) {
    const {
      id_detalle_sufragio,
      genero,
      departamento,
      municipio,
      dui,
      codigo,
    } = payload;

    return this.DestinoSufragioService.crearVoto(
      id_detalle_sufragio,
      genero,
      departamento,
      municipio,
      dui,
      codigo,
    );
  }

  @MessagePattern(DestinoSufragioMSG.VERIFY_STATUS_VOTE)
  async verificarVoto(@Payload() payload: any) {
    const { ledger_id } = payload;
    return this.DestinoSufragioService.verificarVoto(ledger_id);
  }

  @MessagePattern(DestinoSufragioMSG.VALIDATE_VOTE)
  async validarVoto(@Payload() payload: any) {
    const { ledger_id, id_detalle_sufragio} = payload;
    return this.DestinoSufragioService.validarVoto(ledger_id, id_detalle_sufragio);
  }

  @MessagePattern(DestinoSufragioMSG.CAST_VOTE)
  async emitirVoto(@Payload() payload: any) {
    const { ledger_id, candidato_id, id_detalle_sufragio} = payload;
    
    return this.DestinoSufragioService.emitirVoto(ledger_id, candidato_id, id_detalle_sufragio);
  }
}
