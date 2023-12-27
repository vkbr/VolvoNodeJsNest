import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthRefreshInput } from './dto/auth-refresh.input';
import { SigninInput, SignupInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.output';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async signIn(
    @Args('data') singInInput: SigninInput,
    @Context() context: any,
  ) {
    return this.authService.signIn(context.user);
  }

  @Mutation(() => AuthResponse)
  signUp(@Args('data') signUpInput: SignupInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse)
  refreshAccessToken(@Args('data') authRefreshInput: AuthRefreshInput) {
    return this.authService.refreshAccessToken(authRefreshInput.refreshToken);
  }
}
