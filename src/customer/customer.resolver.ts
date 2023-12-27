import {
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CustomerRole } from '@prisma/client';
import { Customer } from 'lib/entities/customer.entity';
import { RolesDecorator } from 'src/lib/decorators/role.decorator';
import { Role } from 'src/lib/entities/role.entity';
import { JwtAuthGuard } from 'src/lib/guards/jwt-auth.guard';
import { RoleGuard } from 'src/lib/guards/jwt-role.guard';
import { CustomerService } from './customer.service';
import { CustomerVerificationCode } from './dto/customer-code.output';
import { UpdateCustomerInput } from './dto/customer-update.input';
import { GetCustomerInput, WhereCustomerInput } from './dto/customer.input';
import { VerifyCodeInput } from './dto/verify-code.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  @UseGuards(JwtAuthGuard)
  async customers(
    @Args('data') { skip, take, where }: GetCustomerInput,
    @Context() context: ExecutionContext,
  ) {
    console.log((context as any).req.allowedForRoles);
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer, { name: 'customer' })
  @RolesDecorator({ roles: [CustomerRole.ADMIN], customerIdPath: 'data.id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findCustomerByIdOrEmail(
    @Args('query') { id, email }: WhereCustomerInput,
  ) {
    return this.customerService.findWhere({ id, email });
  }

  @Query(() => CustomerVerificationCode)
  @RolesDecorator({ roles: [CustomerRole.ADMIN], customerIdPath: 'data.id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getVerificationCode(
    @Args('data') params: WhereCustomerInput,
    @Context() context: any,
  ) {
    /**
     * NOTE: This is just a utility method to view code so that we can try out verification feature.
     * IN PRACTICE this method would not exist and customers would get the code via am email which they can use to verify after signup.
     */
    if (context.req.user.role !== CustomerRole.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    return this.customerService.getCustomerCode(params);
  }

  @Mutation(() => Customer, { name: 'customer' })
  @RolesDecorator({ roles: [CustomerRole.ADMIN], customerIdPath: 'data.id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateCustomer(@Args('data') payload: UpdateCustomerInput) {
    return this.customerService.updateCustomer(payload);
  }

  @Mutation(() => Customer, { nullable: true })
  @RolesDecorator({ roles: [CustomerRole.ADMIN], customerIdPath: 'data.id' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  async removeCustomer(
    @Args('data') deleteCustomerInput: WhereCustomerInput,
  ): Promise<Customer> {
    return this.customerService.deleteWhere(deleteCustomerInput);
  }

  @Mutation(() => Customer)
  @UseGuards(JwtAuthGuard)
  async verifyCode(
    @Args('data') verifyCodeInput: VerifyCodeInput,
    @Context() context: any,
  ) {
    return this.customerService.verifyCode(
      verifyCodeInput,
      context.req?.user?.id,
    );
  }

  @ResolveField('role', () => Role)
  async findCutomerRole(@Parent() customer: Customer) {
    const record = await this.customerService.findRoleByCustomerId(customer.id);
    return record
      ? {
          name: record.role,
        }
      : null;
  }
}
