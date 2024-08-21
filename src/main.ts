import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { configureApp } from './configure-app';
import { EnvironmentVariablesDto } from './config/dto/config.dto';
import { appName, appVersion } from './utils/get-project-data';

async function bootstrap() {
  const logger = new Logger(appName, {
    timestamp: true,
  });

  logger.log(`Starting ${appName} (v${appVersion})...`);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger },
  );

  const configService =
    app.get<ConfigService<EnvironmentVariablesDto, true>>(ConfigService);

  configureApp(app, configService);

  const port = configService.getOrThrow('APP_PORT', { infer: false });
  const host = configService.getOrThrow('APP_HOST', { infer: false });

  logger.log(`App will listen on ${host}:${port}`);

  await app.listen(port, host);

  logger.log(`App listening on ${host}:${port}`);
}
bootstrap();
