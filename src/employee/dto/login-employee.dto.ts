import { ApiProperty } from '@nestjs/swagger';

export class LoginEmployeeDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
