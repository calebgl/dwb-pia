import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsIn, Length } from 'class-validator';
import { EmployeeRoles } from './roles.enum';

export class UpdateEmployeeDto {
  @ApiPropertyOptional()
  @IsAlpha()
  @Length(3, 16)
  username?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @Length(3, 256)
  email?: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: EmployeeRoles,
    default: EmployeeRoles.COMMON,
  })
  @IsIn([EmployeeRoles.COMMON, EmployeeRoles.SUPERIOR])
  role?: EmployeeRoles;

  @ApiHideProperty()
  last_seen?: Date;
}
