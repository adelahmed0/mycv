import { Body, Controller, Post, Session, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

interface SessionData {
  color?: string;
}

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: SessionData) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: SessionData): string | undefined {
    return session.color;
  }
  @Post('sign-up')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('signin')
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }
}
