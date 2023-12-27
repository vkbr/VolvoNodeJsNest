import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
})
export class CustomerModule {}
