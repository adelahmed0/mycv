import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../users.entity';
import { UsersService } from '../users.service';

interface SessionData {
  userId?: number;
}

interface RequestWithUser extends Request {
  session: SessionData;
  currentUser?: User | null;
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      if (user) {
        request.currentUser = user;
      }
    }

    return handler.handle();
  }
}
