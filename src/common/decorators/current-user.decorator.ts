import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JWTPayload } from '../../auth/models_dtos/interface';

export const CurrentUser = createParamDecorator<JWTPayload>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JWTPayload;
  },
);
