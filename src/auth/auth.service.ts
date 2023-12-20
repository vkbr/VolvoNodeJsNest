import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingUtil } from 'src/lib/crypto/hashing';
import { PrismaService } from 'src/prisma.service';
import { SignInResponse } from './dto/auth.output';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private hashingUtil: HashingUtil,
  ) {}

  async signIn(email: string, password: string): Promise<SignInResponse> {
    const user = await this.prismaService.customer.findUnique({
      where: {
        email,
      },
    });

    const hashedPasswordToVerify = this.hashingUtil.hashPassword(password);

    if (hashedPasswordToVerify !== user.password) {
      throw new UnauthorizedException();
    }

    const signInResponse = new SignInResponse();
    signInResponse.accessToken = '';
    signInResponse.refreshToken = '';

    return signInResponse;
  }
}
