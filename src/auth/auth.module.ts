import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LocalStragety } from './local.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [],
  providers: [AuthService, AuthResolver, PrismaService, LocalStragety],
})
export class AuthModule {}
