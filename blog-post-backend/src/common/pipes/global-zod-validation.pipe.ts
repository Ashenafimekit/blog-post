import { Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValiationPipe } from './zod-validation.pipe';

@Injectable()
export class GlobalZodValidationPipe extends ZodValiationPipe {
  constructor() {
    super({} as ZodSchema); // Initialize with empty schema
  }
}
