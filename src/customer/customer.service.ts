import { Injectable } from '@nestjs/common';
import { HashingUtil } from 'src/lib/crypto/hashing';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCustomerInput,
  GetCustomerInput,
  UpdateCustomerInput,
  WhereCustomerInput,
} from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private hachingUtil: HashingUtil,
  ) {}

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
    return this.prisma.customer.findUnique({
      where: {
        id: params.id,
        email: params.email,
      },
    });
  }

  async createCustomer(params: CreateCustomerInput) {
    return this.prisma.customer.create({
      data: {
        email: params.email,
        password: this.hachingUtil.hashPassword(params.password), // Missing Salt in customer table
      },
    });
  }

  async updateCustomer(params: UpdateCustomerInput) {
    const { id, ...rest } = params;
    return this.prisma.customer.update({
      where: {
        id,
      },
      data: rest,
    });
  }
}
