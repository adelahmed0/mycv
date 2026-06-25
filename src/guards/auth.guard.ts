import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface SessionData {
  userId?: number;
}

interface RequestWithSession extends Request {
  session: SessionData;
}

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    return !!request.session.userId;
  }
}
