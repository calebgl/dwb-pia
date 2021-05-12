import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { employee as Employee } from '@prisma/client';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configSerice: ConfigService,
  ) {}

  generateJwt(employee: Partial<Employee>) {
    return this.jwtService.signAsync({ employee });
  }

  hashPassword(password: string) {
    return hash(password, {
      hashLength: this.configSerice.get('HASH_LENGTH'),
    });
  }

  comparePassword(hash: string, password: string) {
    return verify(hash, password);
  }
}
