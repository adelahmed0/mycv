import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users.entity';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): User | null | undefined => {
    const request = context
      .switchToHttp()
      .getRequest<{ currentUser?: User | null }>();

    return request.currentUser;
  },
);
