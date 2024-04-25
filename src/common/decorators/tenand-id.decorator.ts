import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { DB_ROLES } from 'src/constants';

export const TenantId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request?.user || !request?.user?.role) {
    return DB_ROLES.Guest;
  }

  const tenantId = request.user.role;
  const allowedIds = Object.values(DB_ROLES);

  if (allowedIds.includes(tenantId)) {
    return tenantId;
  }

  return DB_ROLES.Guest;
});
