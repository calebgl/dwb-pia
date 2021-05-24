import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsIn, Length } from 'class-validator';
import { EmployeeRoles } from './roles.enum';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsAlpha()
  @Length(3, 16)
  username: string;

  @ApiProperty()
  @IsEmail()
  @Length(3, 256)
  email: string;

  @ApiProperty()
  @Length(8, 32)
  password: string;

  @ApiProperty({
    type: 'enum',
    enum: EmployeeRoles,
    default: EmployeeRoles.COMMON,
  })
  @IsIn([EmployeeRoles.COMMON, EmployeeRoles.SUPERIOR])
  role: EmployeeRoles;

  @ApiHideProperty()
  created_on: Date;

  @ApiHideProperty()
  last_seen: Date;
}
