import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users.entity';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<{ currentUser: User }>();

    return request.currentUser;
  },
);
