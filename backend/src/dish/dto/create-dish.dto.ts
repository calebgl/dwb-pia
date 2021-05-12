import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';

export class CreateDishDto {
  @ApiProperty()
  dish_name: string;

  @ApiProperty()
  dish_price: Decimal;

  @ApiProperty()
  quantity: number;

  @ApiPropertyOptional()
  dish_image?: string;
}
