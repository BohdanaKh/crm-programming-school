import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsRegexMatch(
  pattern: RegExp,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRegexMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [pattern],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null || value === '') {
            return true; // Skip validation for empty or null values
          }

          const [pattern] = args.constraints;
          return pattern.test(value);
        },
      },
    });
  };
}
