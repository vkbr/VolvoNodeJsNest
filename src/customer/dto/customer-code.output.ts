import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerVerificationCode {
  @Field()
  code!: string;
}
