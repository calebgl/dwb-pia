import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import { IsNumber, IsUrl, Length, MaxLength, Min } from 'class-validator';

export class CreateDishDto {
  @ApiProperty()
  @Length(3, 32)
  dish_name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  dish_price: Decimal;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional()
  @IsUrl()
  @MaxLength(128)
  dish_image?: string;
}
