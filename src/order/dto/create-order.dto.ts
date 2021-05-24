import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import { Length } from 'class-validator';

interface DishIds {
  id: number;
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @Length(3, 128)
  ship_address: string;

  @ApiProperty()
  @Length(2, 16)
  ship_postal_code: string;

  @ApiProperty({ default: [{ id: 0, amount: 0 }] })
  dish_ids: DishIds[];
}
