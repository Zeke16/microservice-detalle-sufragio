import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DestinoSufragioMSG } from 'src/common/constantes';
import { DestinoSufragioService } from './destino-sufragio.service';

@Controller()
export class DestinoSufragioController {
    constructor(private readonly DestinoSufragioService: DestinoSufragioService) {}

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

  @MessagePattern(DestinoSufragioMSG.UPDATE)
  async update(@Payload() payload: any) {
    const { id, destinoSufragioDTO } = payload;
    return this.DestinoSufragioService.update(id, destinoSufragioDTO);
  }

  @MessagePattern(DestinoSufragioMSG.DELETE)
  async delete(@Payload() id: number) {
    return this.DestinoSufragioService.delete(id);
  }

  @MessagePattern(DestinoSufragioMSG.SET_STATUS_VOTE)
  async changeStatus(@Payload() payload: any) {
    const { id,  id_usuario } = payload;

    return this.DestinoSufragioService.changeStatus(id,  id_usuario);
  }

  @MessagePattern(DestinoSufragioMSG.FIND_BY_DUI)
  async findByDui(@Payload() payload: any) {
    return await this.DestinoSufragioService.findByDui(payload);
  }
}
