import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateCustomerInput } from './dto/customer-update.input';
import { GetCustomerInput, WhereCustomerInput } from './dto/customer.input';
import { VerifyCodeInput } from './dto/verify-code.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async findWhere(params: WhereCustomerInput) {
    this.assertNonEmptyParams(params);

    const user = await this.prisma.customer.findUnique({
      where: params,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getCustomerCode(params: WhereCustomerInput) {
    this.assertNonEmptyParams(params);

    const code = await this.prisma.customerVerifyToken.findFirst({
      where: {
        customer: params,
      },
    });

    if (!code) {
      throw new NotFoundException('Code not found');
    }

    return {
      code: code.token,
    };
  }

  async updateCustomer(params: UpdateCustomerInput) {
    this.assertNonEmptyParams(params);

    const { id, email, ...rest } = params;

    return this.prisma.customer.update({
      where: {
        id,
        email,
      },
      data: {
        ...rest,
        email,
      },
    });
  }

  async deleteWhere(params: WhereCustomerInput) {
    const existingUser = await this.prisma.customer.findFirst({
      where: params,
    });

    if (!existingUser) {
      throw new NotFoundException('Customer does not exist');
    }

    return this.prisma.customer.delete({
      where: params,
    });
  }

  async verifyCode(input: VerifyCodeInput, customerId: string) {
    const customerWithCode = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
      },
      include: {
        verify: true,
      },
    });

    if (customerWithCode.verify.token !== input.code) {
      throw new UnauthorizedException('The code you provided is not valid.');
    }
    const verifiedUser = await this.prisma.customer.update({
      data: {
        isVerified: true,
      },
      where: {
        id: customerId,
      },
    });

    return verifiedUser;
  }

  async findRoleByCustomerId(customerId: string) {
    return this.findByCustomerId(customerId);
  }

  private async findByCustomerId(customerId: string) {
    return this.prisma.customerRoles.findUnique({
      where: {
        customerId,
      },
    });
  }

  private assertNonEmptyParams(params: WhereCustomerInput) {
    if (!params.id && !params.email) {
      throw new BadRequestException(
        'Either of "id" or "email" must be present',
      );
    }
  }
}
