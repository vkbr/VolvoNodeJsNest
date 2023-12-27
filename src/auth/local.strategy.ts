import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Customer } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStragety extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Customer> {
    const customer = await this.authService.validateCustomer(email, password);

    if (!customer) {
      throw new UnauthorizedException();
    }

    return customer as Customer;
  }
}
