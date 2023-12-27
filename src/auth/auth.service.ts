import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomerRole } from '@prisma/client';
import { Customer } from 'src/lib/entities/customer.entity';
import { PrismaService } from 'src/prisma.service';
import { SignupInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.output';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private get accessTokenSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }
  private get refreshTokenSecret() {
    return this.configService.get<string>('REFRESH_SECRET');
  }

  async signIn(customer: Customer): Promise<AuthResponse> {
    if (!customer) {
      throw new UnauthorizedException();
    }

    const tokenInfo = this.generateTokens(customer);

    await this.connectRefreshToken(customer, tokenInfo.refreshToken);

    return {
      ...tokenInfo,
      customer,
    };
  }

  async signUp(signUpInput: SignupInput): Promise<AuthResponse> {
    const existingUser = await this.prismaService.customer.findFirst({
      where: {
        email: signUpInput.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        `User with email '${signUpInput.email}' already exist`,
      );
    }
    const createdCustomer = await this.prismaService.customer.create({
      data: {
        email: signUpInput.email,
        password: signUpInput.password,

        role: {
          create: {
            role: CustomerRole.USER,
          },
        },

        verify: {
          create: {
            token: Math.random().toString(36).substring(2, 8).toUpperCase(),
          },
        },
      },
    });

    const tokenInfo = this.generateTokens(createdCustomer);

    await this.connectRefreshToken(createdCustomer, tokenInfo.refreshToken);

    return {
      ...tokenInfo,
      customer: createdCustomer,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload: { id: string } = this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenSecret,
      });

      const customer = await this.prismaService.customer.findUnique({
        where: {
          id: payload.id,
        },
        include: {
          tokenInfo: {
            where: {
              refreshToken: refreshToken,
            },
          },
        },
      });

      /*
       Refresh token can be deleted by user
       Eg. by calling "sign-out from everywhere" feature, not implemented here
       Therefore adding an extra check on tokenInfo being present in DB
        */
      if (!customer.tokenInfo) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        accessToken: this.createAccessToken(customer.id),
        refreshToken,
        customer,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async validateCustomer(email: string, password: string) {
    return this.prismaService.customer.findFirst({
      where: {
        email,
        password, // TODO: secure password
      },
    });
  }

  private async connectRefreshToken(customer: Customer, refreshToken: string) {
    const decodedRefreshToken = this.jwtService.decode(refreshToken, {
      json: true,
    });

    const expMs: number = decodedRefreshToken.exp * 1000;

    return this.prismaService.customer.update({
      data: {
        tokenInfo: {
          create: {
            refreshToken,
            expiresAfter: new Date(expMs),
          },
        },
      },
      where: {
        id: customer.id,
      },
    });
  }

  private generateTokens(customer: Customer) {
    const accessToken = this.createAccessToken(customer.id);
    const refreshToken = this.createRefreshToken(customer.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private createAccessToken(customerId: string) {
    return this.signJwt(customerId, '1h', this.accessTokenSecret);
  }

  private createRefreshToken(customerId: string) {
    return this.signJwt(customerId, '1d', this.refreshTokenSecret);
  }

  private signJwt(
    id: string,
    expiry: `${number}${'s' | 'm' | 'h' | 'd' | 'y'}`,
    secret: string,
  ) {
    return this.jwtService.sign({ id }, { expiresIn: expiry, secret });
  }
}
