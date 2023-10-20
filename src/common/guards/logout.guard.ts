import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

import { TokenType } from '../../auth/models_dtos/enums';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    @InjectRedisClient() private redisClient: RedisClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.headers && request.headers.authorization) {
      const extractToken = request.headers.authorization.split(' ');
      if (extractToken[0] == 'Bearer' && extractToken[1] != '') {
        const jwtToken = extractToken[1];
        const user = await this.tokenService.verifyToken(
          jwtToken,
          TokenType.Access,
        );
        const userId = user.id;
        try {
          await this.redisClient.exists(jwtToken);
        } catch (e) {
          throw new NotFoundException('Token not found');
        }
        await this.redisClient.del([
          `accessToken:${userId}`,
          `refreshToken:${userId}`,
        ]);
        // await this.redisClient.del(`refreshToken:${userId}`);
        return true;
        // if (!(await this.redisClient.exists(jwtToken))) {
        //   return false;
        // } else {
        //   await this.redisClient.del(`accessToken:${userId}`);
        //   await this.redisClient.del(`refreshToken:${userId}`);
        //
        //   return true;
        // }
      }
    }
    return false;
  }
}
