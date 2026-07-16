import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UserOwnerGuard } from '../guards/user-owner.guard';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController, UsersController],
  providers: [UsersService, AuthService, UserOwnerGuard],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
