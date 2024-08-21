import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as defaultValues from './config/default-values';
import { EnvironmentVariablesDto } from './config/dto/config.dto';
import { validateEnvironmentVariables } from './utils/validate-env-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => defaultValues],
      validate: (config) =>
        validateEnvironmentVariables(config, EnvironmentVariablesDto),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
