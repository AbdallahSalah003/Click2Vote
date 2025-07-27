import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT') || '3000');
  const clientPort = parseInt(configService.get('CLIENT_PORT') || '5173');
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9][1-9]\d):${clientPort}$/`),
    ],
  });
  await app.listen(port);
}
bootstrap();
