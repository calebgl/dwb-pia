import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { employee as Employee } from '@prisma/client';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  // Verifica si el empleado cuenta con un rol adecuado
  // para realizar ciertas acciones.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const employee: Employee = request.user.employee;

    return this.prismaService.employee
      .findUnique({
        where: { employee_id: employee.employee_id },
      })
      .then((emp) => {
        const hasRole = (): boolean => roles.indexOf(employee.role) > -1;
        let hasPermission: boolean = false;

        if (hasRole()) hasPermission = true;
        return emp && hasPermission;
      });
  }
}
