import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthRefreshInput {
  @Field()
  refreshToken!: string;
}
