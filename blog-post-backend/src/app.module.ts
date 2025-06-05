import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [UserModule, PostModule, PrismaModule, AuthModule, CaslModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
