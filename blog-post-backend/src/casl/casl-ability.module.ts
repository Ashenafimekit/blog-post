import { Module } from '@nestjs/common';
import { caslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [caslAbilityFactory],
  exports: [caslAbilityFactory],
})
export class ClassModule {}
