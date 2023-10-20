import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenType } from '../../auth/models_dtos/enums';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
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

      const user = await this.tokenService.verifyToken(token, TokenType.Access);
      request['user'] = user;
      return this.matchRoles(roles, user.role);
    }
    return false;
  }
}
