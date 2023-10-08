import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as process from 'process';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (request.headers && request.headers.authorization) {
      const token = request.headers.authorization?.split(' ')[1];

      const secret = process.env.JWT_SECRET_KEY;
      const user = await this.authService.verify(token, secret);
      console.log(user);
      return this.matchRoles(roles, user.role);
    }
    return false;
  }
}
