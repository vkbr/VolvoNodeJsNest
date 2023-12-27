import { Field, InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
abstract class AuthBase {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class SigninInput extends AuthBase {}

@InputType()
export class SignupInput extends AuthBase {}
