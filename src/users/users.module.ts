import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController, UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
