import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  getRequest(context: ExecutionContext) {
    console.log('JwtAuthGuard::getRequest');
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);

    console.log('JwtAuthGuard::canActivate', ctx.getContext().req.user);

    return super.canActivate(context);
  }
}
