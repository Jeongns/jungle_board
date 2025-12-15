import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PostModule,
    CommentModule,
    BoardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
