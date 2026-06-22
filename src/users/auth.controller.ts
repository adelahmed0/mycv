import { Body, Controller, Post, Session, Get } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';

interface SessionData {
  userId?: number;
}

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/whoami')
  async whoami(@Session() session: SessionData): Promise<User> {
    return this.authService.findOne(session.userId);
  }

  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }
}
