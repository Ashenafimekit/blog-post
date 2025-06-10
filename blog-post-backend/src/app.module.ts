import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [UserModule, PostModule, PrismaModule, AuthModule, CaslModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'user', method: RequestMethod.ALL })
      .forRoutes({ path: 'post', method: RequestMethod.ALL });
  }
}
