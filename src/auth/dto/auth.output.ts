import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from 'src/lib/entities/customer.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field()
  customer!: Customer;
}
