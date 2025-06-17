/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValiationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedValue;
    } catch (error) {
      console.log('🚀 ~ ZodValiationPipe ~ transform ~ error:', error);
      throw new BadRequestException('validation failed');
    }
  }
}
