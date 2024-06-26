import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`- [${new Date().toLocaleTimeString()}] Local guard.`);
    console.log(context.switchToHttp().getRequest()?.user);

    return super.canActivate(context);
  }
}
