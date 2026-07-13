import {
  Controller,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { UpdateUserDto } from './dtos/update-user.dto';

import { UsersService } from './users.service';

import { Serialize } from '../interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';

import { AuthGuard } from '../guards/auth.guard';

import { UserOwnerGuard } from '../guards/user-owner.guard';

import { CurrentUser } from './decorators/current-user.decorator';

import { User } from './users.entity';

@Controller('users')
@Serialize(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(UserOwnerGuard)
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string, @CurrentUser() user: User) {
    if (email !== user.email) {
      throw new ForbiddenException('not authorized');
    }

    return this.usersService.find(email);
  }

  @UseGuards(UserOwnerGuard)
  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(UserOwnerGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,

    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
