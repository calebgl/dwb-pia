import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import {
  ThrowBadRequestException,
  ThrowMethodNotAllowedException,
  ThrowNotFoundException,
} from 'src/utils/utils';
import { EmployeeRoles } from './dto/roles.enum';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async findAll() {
    return await this.prismaService.employee.findMany({
      select: {
        employee_id: true,
        username: true,
        role: true,
        created_on: true,
        last_seen: true,
      },
      orderBy: { created_on: 'asc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.findById(id);

    delete employee.email;
    delete employee.password;

    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    if ((await this.findAll()).length > 50)
      ThrowMethodNotAllowedException(
        'La cantidad de empleados alcanzó su límite',
      );

    const { username, email, password, role } = createEmployeeDto;

    if (role !== EmployeeRoles.SUPERIOR && role !== EmployeeRoles.COMMON)
      ThrowBadRequestException('Rol no encontrado');

    const hash = await this.authService.hashPassword(password);

    const newEmployee = await this.prismaService.employee.create({
      data: {
        employee_id: uuid(),
        username,
        email,
        password: hash,
        role,
        created_on: new Date(),
        last_seen: new Date(),
      },
    });

    delete newEmployee.email;
    delete newEmployee.password;
    delete newEmployee.last_seen;

    return newEmployee;
  }

  // TODO: evitar que el sa se pueda modificar
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findById(id);

    employee.username = updateEmployeeDto.username ?? employee.username;
    employee.email = updateEmployeeDto.email ?? employee.email;
    employee.role = updateEmployeeDto.role ?? employee.role;
    employee.last_seen = new Date();

    const updatedEmployee = await this.prismaService.employee.update({
      where: { employee_id: id },
      data: {
        username: employee.username,
        email: employee.email,
        role: employee.role,
        last_seen: employee.last_seen,
      },
    });

    delete updatedEmployee.password;

    return updatedEmployee;
  }

  // TODO: evitar que el sa se pueda eliminar
  async remove(id: string) {
    const removedEmployee = await this.findById(id);

    await this.prismaService.employee.delete({
      where: { employee_id: id },
    });

    delete removedEmployee.email;
    delete removedEmployee.password;

    return removedEmployee;
  }

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const employee = await this.validateEmployee(
      loginEmployeeDto.email,
      loginEmployeeDto.password,
    );

    const loggedEmployee = await this.update(employee.employee_id, {
      last_seen: new Date(),
    });

    delete loggedEmployee.created_on;
    delete loggedEmployee.last_seen;

    const jwt = await this.authService.generateJwt(loggedEmployee);

    return jwt;
  }

  async validateEmployee(email: string, password: string) {
    const employee = await this.findByMail(email);
    const verify = await this.authService.comparePassword(
      employee.password,
      password,
    );

    if (!verify)
      ThrowBadRequestException(
        'El correo y contraseña no coindicen con nuestros registros',
      );

    delete employee.email;
    delete employee.password;

    return employee;
  }

  private async findByMail(email: string) {
    return await this.prismaService.employee.findUnique({
      where: { email },
      rejectOnNotFound: () =>
        ThrowBadRequestException(
          'El correo y contraseña no coindicen con nuestros registros',
        ),
    });
  }

  private async findById(id: string) {
    if (!uuidValidate(id)) ThrowBadRequestException('UUID no válido');

    const employee = await this.prismaService.employee.findUnique({
      where: { employee_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Empleado no encontrado'),
    });

    return employee;
  }
}
