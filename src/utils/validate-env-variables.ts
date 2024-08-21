import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export declare type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export function validateEnvironmentVariables(
  config: Record<string, unknown>,
  cls: ClassConstructor<object>,
): object | Record<string, never> {
  const validatedConfig = plainToClass(cls, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
