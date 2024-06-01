import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoles } from 'src/enums/user-roles.enum';

export const TeamManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user && request.user.role === UserRoles.TEAM_MANAGER) {
      return request.user;
    } else {
      return null;
    }
  },
);
