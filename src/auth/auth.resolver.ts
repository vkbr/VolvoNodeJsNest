import { Controller } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInResponse } from './dto/auth.output';

@Controller('auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(
    @Args('email', { type: () => String }) email: string,
    @Args('password', { type: () => String }) password: string,
  ) {
    return this.authService.signIn(email, password);
  }
}
