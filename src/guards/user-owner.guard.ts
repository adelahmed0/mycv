import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../users/users.entity';

interface RequestWithUser {
  params: { id: string };
  currentUser?: User | null;
}

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const paramId = parseInt(request.params.id, 10);

    if (!request.currentUser || request.currentUser.id !== paramId) {
      throw new ForbiddenException('not authorized');
    }

    return true;
  }
}
