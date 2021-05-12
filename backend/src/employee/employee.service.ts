import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import { normalizeDate } from 'src/utils/utils';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

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
      },
      select: {
        employee_id: true,
        username: true,
        email: true,
        created_on: true,
      },
    });

    newEmployee.created_on = normalizeDate(newEmployee.created_on);

    return newEmployee;
  }

  async findAll() {
    const employees = await this.prismaService.employee.findMany({
      select: {
        employee_id: true,
        username: true,
        email: true,
        created_on: true,
      },
    });

    employees.map((employee) => {
      employee.created_on = normalizeDate(employee.created_on);
      return employee;
    });

    return employees;
  }

  async findOne(id: string) {
    const employee = await this.findById(id);

    if (!employee) throw new NotFoundException('Empleado no encontrado');

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // return `This action updates a #${id} employee`;
    return updateEmployeeDto;
  }

  async remove(id: string) {
    const employee = await this.findById(id);

    if (!employee) throw new NotFoundException('Empleado no encontrado');

    await this.prismaService.employee.delete({
      where: { employee_id: id },
      select: { employee_id: true, username: true, email: true },
    });

    return employee;
  }

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const employee = await this.validateEmployee(
      loginEmployeeDto.email,
      loginEmployeeDto.password,
    );

    if (!employee) return;

    const updatedEmployee = await this.prismaService.employee.update({
      where: { employee_id: employee.employee_id },
      data: { last_login: new Date() },
    });

    delete updatedEmployee.password;
    delete updatedEmployee.created_on;

    const jwt = await this.authService.generateJwt(updatedEmployee);

    return jwt;
  }

  async validateEmployee(email: string, password: string) {
    const employee = await this.findByMail(email);

    if (!employee) throw new NotFoundException('invalid credentials');

    const verify = await this.authService.comparePassword(
      employee.password,
      password,
    );

    if (!verify) throw new BadRequestException('invalid credentials');

    delete employee.password;
    return employee;
  }

  async findByMail(email: string) {
    return await this.prismaService.employee.findFirst({ where: { email } });
  }

  private async findById(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('UUID no válido');

    const employee = await this.prismaService.employee.findUnique({
      where: { employee_id: id },
      select: {
        employee_id: true,
        username: true,
        email: true,
        created_on: true,
      },
    });

    if (!employee) throw new NotFoundException('Empleado no encontrado');

    employee.created_on = normalizeDate(employee.created_on);

    return employee;
  }
}
