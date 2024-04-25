import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DB_ROLES } from 'src/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === DB_ROLES.Admin) {
      return true;
    }

    console.log(
      `- [${new Date().toLocaleTimeString()}] Roles guard. Allowed: [${roles}]. User role: ${user.role}`,
    );
    console.log(context.switchToHttp().getRequest()?.user);

    if (roles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
