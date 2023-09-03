import { Module } from '@nestjs/common';
import { DestinoSufragioController } from './destino-sufragio.controller';
import { DestinoSufragioService } from './destino-sufragio.service';
import { PrismaService } from 'src/database/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.prod',
    }),
  ],
  controllers: [DestinoSufragioController],
  providers: [DestinoSufragioService, PrismaService],
})
export class DestinoSufragioModule {}
