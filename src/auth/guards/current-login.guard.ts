import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/employee/employee.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CurrentLoginGuard implements CanActivate {
  constructor(
    // @Inject(forwardRef(() => EmployeeService))
    // private employeeService: EmployeeService,
    private prismaService: PrismaService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    return this.prismaService.employee
      .findUnique({
        where: { employee_id: params.id },
      })
      .then((emp) => {
        let hasPermission = false;

        const validation =
          emp.employee_id === request.user.employee.employee_id ||
          request.user.employee.role === 'admin';

        if (validation) hasPermission = true;

        return emp && hasPermission;
      });
  }
}
