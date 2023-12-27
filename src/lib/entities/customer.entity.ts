import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from 'lib/entities/base.entity';
import { Role } from './role.entity';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email!: string;

  @Field()
  isVerified!: boolean;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
