import { Module } from '@nestjs/common';
import { HashingUtil } from 'src/lib/crypto/hashing';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [AuthResolver],
  providers: [AuthService, PrismaService, HashingUtil],
})
export class AuthModule {}
