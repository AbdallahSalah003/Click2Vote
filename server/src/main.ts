import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './sockets/socket-io-adapter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)'); 
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT') || '3000');
  const clientPort = parseInt(configService.get('CLIENT_PORT') || '5173');
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}$/`),
    ],
    credentials: true
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
