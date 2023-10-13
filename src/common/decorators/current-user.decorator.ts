import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JWTPayload } from '../../auth/models_dtos/interface';
import { AuthService } from "../../auth/auth.service";


export const CurrentUser = createParamDecorator<JWTPayload>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const decoded = AuthService.decode(token);
    return decoded;
    return request.user as JWTPayload;
  },
);
