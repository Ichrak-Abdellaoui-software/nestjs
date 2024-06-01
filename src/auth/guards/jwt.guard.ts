// src/auth/guards/jwt.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const canActivate = super.canActivate(context);
    if (canActivate instanceof Observable) {
      return await lastValueFrom(canActivate);
    } else if (canActivate instanceof Promise) {
      return await canActivate;
    } else {
      return canActivate;
    }
  }
}
