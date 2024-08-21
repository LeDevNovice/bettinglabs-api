import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import * as BASE_CONFIG from '../default-values';

export class EnvironmentVariablesDto {
  @IsString()
  @IsNotEmpty()
  APP_HOST = BASE_CONFIG.DEFAULT_APP_HOST;

  @IsNumber()
  @Type(() => Number)
  APP_PORT = BASE_CONFIG.DEFAULT_APP_PORT;

  @IsString()
  @IsNotEmpty()
  NODE_ENV = BASE_CONFIG.DEFAULT_NODE_ENV;
}
