import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyCodeInput {
  @Field()
  code!: string;
}
