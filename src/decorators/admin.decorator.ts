import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoles } from 'src/enums/user-roles.enum';

export const Admin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user && request.user.role === UserRoles.ADMIN) {
      return request.user;
    } else {
      return null;
    }
  },
);
