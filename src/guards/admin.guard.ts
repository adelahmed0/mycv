import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../users/users.entity';

interface RequestWithUser {
  currentUser?: User;
}

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
