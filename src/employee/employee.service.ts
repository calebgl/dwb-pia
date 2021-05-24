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
import { UpdateEmployeePasswordDto } from './dto/update-employee-password.dto';
import { employee } from '.prisma/client';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  // Busca todos los empleados guardados en la base de datos,
  // ordenándolos por la fecha de creación y selecciona
  // solo ciertos parámetros para mostrarlos en la petición.
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

  // Busca un empleado en base a un id (UUID) y elimina
  // información sensitiva para mostrarlo en la petición.
  async findOne(id: string) {
    const employee = await this.findById(id);

    delete employee.email;
    delete employee.password;

    return employee;
  }

  // Crea un empleado en la base de datos, posteriormente
  // elimina información sensitiva para mostrarlo en la
  // petición.
  // En el dado caso de que existan 50 empleados ya
  // registrados, regresará un error.
  async create(createEmployeeDto: CreateEmployeeDto) {
    if ((await this.findAll()).length > 50)
      ThrowMethodNotAllowedException(
        'La cantidad de empleados alcanzó su límite',
      );

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
    });

    delete newEmployee.email;
    delete newEmployee.password;
    delete newEmployee.last_seen;

    return newEmployee;
  }

  // Actualiza un empleado en la base de datos, posteriormente
  // elimina información sensitiva para mostrarlo en la
  // petición.
  // No se pueden modificar los valores para al sa,
  // si se intenta lanza una excepción de método
  // no permitido.
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findById(id);

    if (employee.email !== 'admin@email.com') {
      employee.username = updateEmployeeDto.username ?? employee.username;
      employee.email = updateEmployeeDto.email ?? employee.email;
      employee.role = updateEmployeeDto.role ?? employee.role;
    }

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

  // Elimina un empleado en la base de datos, posteriormente
  // elimina información sensitiva para mostrarlo en la
  // petición.
  // No se pueden eliminar al sa, si se intenta
  // lanza una excepción de método no permitido.
  async remove(id: string) {
    const removedEmployee = await this.findById(id);

    if (removedEmployee.email === 'admin@email.com')
      ThrowMethodNotAllowedException(
        'No puedes eliminar al System Administrator',
      );

    await this.prismaService.employee.delete({
      where: { employee_id: id },
    });

    delete removedEmployee.email;
    delete removedEmployee.password;

    return removedEmployee;
  }

  // Si un empleado inicia sesión correctamente
  // envía un JWT token.
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

  // Verifica que las credenciales propocionadas
  // coincidan con los registros de la base de datos.
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

  // Encuentra un empleado en base al correo
  // electrónico. Si este no es encontrado lanza
  // una error de solicitud incorrecta.
  private async findByMail(email: string) {
    return await this.prismaService.employee.findUnique({
      where: { email },
      rejectOnNotFound: () =>
        ThrowBadRequestException(
          'El correo y contraseña no coindicen con nuestros registros',
        ),
    });
  }

  // Busca un empleado en base a un id (UUID).
  // En caso de que el UUID proporcionado no sea
  // adecuado lanza una excepción. Lo mismo sucede
  // si el empleado no fue encontrado.
  private async findById(id: string) {
    if (!uuidValidate(id)) ThrowBadRequestException('UUID no válido');

    const employee = await this.prismaService.employee.findUnique({
      where: { employee_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Empleado no encontrado'),
    });

    return employee;
  }

  async updatePassword(updateEmployeePasswordDto: UpdateEmployeePasswordDto) {
    const { email, oldPassword, newPassword } = updateEmployeePasswordDto;

    if (email === 'admin@email.com')
      ThrowMethodNotAllowedException('No puedes cambiar la constraseña del SA');

    const employee = await this.validateEmployee(email, oldPassword);
    const hash = await this.authService.hashPassword(newPassword);

    const updatedEmployee = await this.prismaService.employee.update({
      where: { employee_id: employee.employee_id },
      data: { password: hash },
    });

    delete updatedEmployee.created_on;
    delete updatedEmployee.last_seen;
    delete updatedEmployee.password;

    return updatedEmployee;
  }
}
