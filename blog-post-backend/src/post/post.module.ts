import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';

@Module({
  // imports: [AbilityFactory],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
