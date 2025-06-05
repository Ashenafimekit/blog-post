import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { CaslModule } from 'src/casl/casl.module';
@Module({
  imports: [CaslModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
