import { Module } from '@nestjs/common';
import { HashingUtil } from 'src/lib/crypto/hashing';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomerService, PrismaService, CustomerResolver, HashingUtil],
})
export class CustomerModule {}
