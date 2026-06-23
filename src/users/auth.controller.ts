import {
  Body,
  Controller,
  Post,
  Session,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
interface SessionData {
  userId?: number;
}

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Get('whoami')
  // async whoami(@Session() session: SessionData): Promise<User> {
  //   return this.authService.findOne(session.userId);
  // }

  @Get('whoami')
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Session() session: SessionData) {
    session.userId = undefined;
    return;
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
