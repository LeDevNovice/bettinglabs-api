import { ValidationError } from 'class-validator';

interface ValidationErrorObject {
  [property: string]: string | ValidationErrorObject;
}

export default function generateValidationErrors(
  errors: ValidationError[],
): ValidationErrorObject {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateValidationErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}
