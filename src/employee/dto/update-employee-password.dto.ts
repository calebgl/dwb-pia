import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class UpdateEmployeePasswordDto {
  @ApiProperty()
  @IsEmail()
  @Length(3, 256)
  email: string;

  @ApiProperty()
  @Length(8, 32)
  oldPassword: string;

  @ApiProperty()
  @Length(8, 32)
  newPassword: string;
}
