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

  // Generar un código JWT con el respectivo empleado.
  generateJwt(employee: Partial<Employee>) {
    return this.jwtService.signAsync({ employee });
  }

  // Genera un hash a partir de una contraseña con la
  // configuración indicada.
  hashPassword(password: string) {
    return hash(password, {
      hashLength: this.configSerice.get('HASH_LENGTH'),
    });
  }

  // Verifica si la contraseña coincide con la que está
  // almacenada en la base de datos.
  comparePassword(hash: string, password: string) {
    return verify(hash, password);
  }
}
