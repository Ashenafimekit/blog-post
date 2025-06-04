import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ClassModule } from 'src/casl/casl-ability.module';

@Module({
  imports: [ClassModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
