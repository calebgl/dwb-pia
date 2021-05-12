import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { EmployeeRoles } from './roles.enum';

export class CreateEmployeeDto {
  @ApiHideProperty()
  employeeId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    type: 'enum',
    enum: EmployeeRoles,
    default: EmployeeRoles.COMMON,
  })
  role: EmployeeRoles;

  @ApiHideProperty()
  createdOn: Date;
}
