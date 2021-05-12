import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';

interface DishIds {
  id: number;
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty()
  ship_address: string;

  @ApiProperty()
  ship_postal_code: string;

  @ApiProperty({ default: [{ id: 0, amount: 0 }] })
  dish_ids: DishIds[];
}
