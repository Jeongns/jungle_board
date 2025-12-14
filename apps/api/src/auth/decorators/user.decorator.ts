import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserDto | null => {
    const request = ctx.switchToHttp().getRequest<Express.Request>();
    if (!request.user) {
      return null;
    }
    return request.user;
  },
);
