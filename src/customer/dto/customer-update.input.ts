import { Field, InputType } from '@nestjs/graphql';
import { WhereCustomerInput } from './customer.input';

@InputType()
export class UpdateCustomerInput extends WhereCustomerInput {
  @Field(() => String, { nullable: true })
  password?: string;
}
