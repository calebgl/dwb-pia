import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import {
  ThrowBadRequestException,
  ThrowNotFoundException,
} from 'src/utils/utils';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async findAll() {
    return await this.prismaService.employee.findMany({
      select: this.visibleProperties,
    });
  }

  async findOne(id: string) {
    return await this.findById(id);
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { username, email, password, role } = createEmployeeDto;
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
      select: this.visibleProperties,
    });

    return newEmployee;
  }

  // TODO: evitar que el sa se pueda modificar
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // return `This action updates a #${id} employee`;
    return updateEmployeeDto;
  }

  // TODO: evitar que el sa se pueda eliminar
  async remove(id: string) {
    const employee = await this.findById(id);

    await this.prismaService.employee.delete({
      where: { employee_id: id },
    });

    return employee;
  }

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const employee = await this.validateEmployee(
      loginEmployeeDto.email,
      loginEmployeeDto.password,
    );

    const updatedEmployee = await this.prismaService.employee.update({
      where: { employee_id: employee.employee_id },
      data: { last_seen: new Date() },
    });

    delete updatedEmployee.email;
    delete updatedEmployee.password;
    delete updatedEmployee.created_on;
    delete updatedEmployee.last_seen;

    const jwt = await this.authService.generateJwt(updatedEmployee);

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

    delete employee.password;

    return employee;
  }

  private async findByMail(email: string) {
    return await this.prismaService.employee.findUnique({
      where: { email },
      select: { ...this.visibleProperties, password: true },
      rejectOnNotFound: () =>
        ThrowBadRequestException(
          'El correo y contraseña no coindicen con nuestros registros',
        ),
    });
  }

  async findById(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('UUID no válido');

    const employee = await this.prismaService.employee.findUnique({
      where: { employee_id: id },
      select: this.visibleProperties,
      rejectOnNotFound: () => ThrowNotFoundException('Empleado no encontrado'),
    });

    return employee;
  }

  private visibleProperties = {
    employee_id: true,
    username: true,
    role: true,
    created_on: true,
    last_seen: true,
  };
}
