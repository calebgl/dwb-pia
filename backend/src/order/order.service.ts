import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import {
  ThrowBadRequestException,
  ThrowNotFoundException,
} from 'src/utils/utils';
import { Decimal } from '@prisma/client/runtime';
import { DishService } from 'src/dish/dish.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private dishService: DishService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { dish_ids, ship_address, ship_postal_code } = createOrderDto;
    const order_id = uuid();
    let total = new Decimal(0);

    for await (const order of dish_ids) {
      const dish = await this.dishService.findOne(order.id);

      total = total.add(new Decimal(order.amount).mul(dish.dish_price));
    }

    return await this.prismaService.order_request.create({
      data: {
        order_id,
        total: total,
        ship_address,
        ship_postal_code,
        order_date: new Date(),
        order_details: {
          createMany: {
            data: dish_ids.map((order) => ({
              dish_id: order.id,
              amount: order.amount,
            })),
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prismaService.order_request.findMany({
      orderBy: { order_date: 'desc' },
    });
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) ThrowBadRequestException('UUID no válido');

    return await this.prismaService.order_request.findUnique({
      where: { order_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Platillo no encontrado'),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prismaService.order_request.delete({
      where: { order_id: id },
    });
  }
}
