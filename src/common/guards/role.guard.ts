import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as process from 'process';

import { AuthService } from '../../auth/auth.service';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private authService: AuthService,
    private jwtService: JwtService,
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
      console.log(token);

      const user = await this.jwtService.verifyAsync(token);
      console.log(user);
      return this.matchRoles(roles, user.role);
    }
    return false;
  }
}