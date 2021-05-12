import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeRoles } from './roles.enum';

export class UpdateEmployeeDto {
  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({
    type: 'enum',
    enum: EmployeeRoles,
    default: EmployeeRoles.COMMON,
  })
  role?: EmployeeRoles;

  last_seen?: Date;
}
