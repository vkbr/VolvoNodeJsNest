import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import {
  CreateCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
  WhereCustomerInput,
} from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer)
  async customer(@Args('query') { id, email }: WhereCustomerInput) {
    return this.customerService.findWhere({ id, email });
  }

  @Mutation(() => Customer)
  async createCustomer(@Args('data') payload: CreateCustomerInput) {
    return this.customerService.createCustomer(payload);
  }

  @Mutation(() => Customer)
  async updateCustomer(@Args('data') payload: UpdateCustomerInput) {
    return this.customerService.updateCustomer(payload);
  }
}
