import { Request } from 'express';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends AuthUserDto {}
  }
}
