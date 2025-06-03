import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [UserModule, PostModule, PrismaModule, AuthModule, AbilityModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
