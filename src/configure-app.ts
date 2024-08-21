// import { ConfigService } from '@nestjs/config';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import {
  appVersion,
  appName,
  appDescription,
  appAuthor,
} from './utils/get-project-data';
import generateValidationErrors from './utils/generate-validation-errors';
import { HttpExceptionFilter } from './exceptionFilters/httpExceptionFilter/httpExceptionFilter';
import { EnvironmentVariablesDto } from './config/dto/config.dto';

export function configureApp(
  app: NestFastifyApplication,
  configService: ConfigService<EnvironmentVariablesDto, true>,
) {
  const nodeEnv = configService.getOrThrow('NODE_ENV', { infer: false });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
  });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .setContact(appAuthor, 'url', 'mail')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter(nodeEnv));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: generateValidationErrors(errors),
        });
      },
    }),
  );

  app.enableShutdownHooks();
}
