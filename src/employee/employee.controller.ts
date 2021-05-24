import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentLoginGuard } from 'src/auth/guards/current-login.guard';
import { UpdateEmployeePasswordDto } from './dto/update-employee-password.dto';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('login')
  async login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    const access_token = await this.employeeService.login(loginEmployeeDto);
    return { access_token };
  }

  // @ApiOkResponse({ isArray: true })
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CurrentLoginGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CurrentLoginGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }

  @Patch()
  updatePassword(@Body() updateEmployeePasswordDto: UpdateEmployeePasswordDto) {
    return this.employeeService.updatePassword(updateEmployeePasswordDto);
  }
}
