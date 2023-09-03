import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DestinoSufragioService } from './destino-sufragio/destino-sufragio.service';
import { DestinoSufragioModule } from './destino-sufragio/destino-sufragio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod'],
      isGlobal: true,
    }),
    DestinoSufragioModule,
  ],
})
export class AppModule {}
