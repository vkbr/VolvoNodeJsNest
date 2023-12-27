import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ROLE_META_TAG, RoleDecoration } from '../decorators/role.decorator';
import { EnrichedJwtPayload } from '../types/jwt.payload';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    console.log('RoleGuard::getRequest');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    console.log(
      'RoleGuard',
      GqlExecutionContext.create(context).getContext().req.user,
    );

    const rolesDecoration = this.reflector.get<RoleDecoration>(
      ROLE_META_TAG,
      context.getHandler(),
    );

    if (rolesDecoration) {
      const user: EnrichedJwtPayload = ctx.getContext().req.user;

      if (!user.role) {
        throw new Error('Missing role information for logged in user.');
      }
      const objectId = this.extractIdentifier(
        ctx.getArgs(),
        rolesDecoration.customerIdPath,
      );

      console.log({
        objectId,
        roles: rolesDecoration.roles,
        myRole: user.role,
      });

      if (
        objectId !== user.id &&
        !rolesDecoration.roles.some((role) => role === user.role)
      ) {
        throw new UnauthorizedException(
          'You are not allowed to perform this action',
        );
      }
    }

    return super.canActivate(context);
  }

  private extractIdentifier(args: any, customerIdPath: string) {
    const paths = customerIdPath.split('.');
    let result = args;

    while (result && paths.length) {
      const part = paths.shift();
      result = result[part];
    }

    return result;
  }
}
