import { Injectable } from '@nestjs/common';
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

  // Crea una orden cálculando el total a pagar.
  // Una vez hecho el registro, regresa la orden
  // para mostrarla en la petición
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

  // Busca todas las ordenes hechas en la base
  // de datos, las ordena de manera descentente en base
  // a la fecha de orden para así mostrarlas en
  // la petición.
  async findAll() {
    return await this.prismaService.order_request.findMany({
      orderBy: { order_date: 'desc' },
    });
  }

  // Busca una orden en específico en base al id (UUID)
  // para mostrarla en la petición.
  // Si el id no es válido lanza una excepción.
  // Asímismo, si la orden no fue encontranda, lanza una
  // excepción de no encontrado.
  async findOne(id: string) {
    if (!uuidValidate(id)) ThrowBadRequestException('UUID no válido');

    return await this.prismaService.order_request.findUnique({
      where: { order_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Platillo no encontrado'),
    });
  }

  // Elimina una orden en base de un id (UUID) para
  // después mostrarla en la petición.
  async remove(id: string) {
    await this.findOne(id);
    return await this.prismaService.order_request.delete({
      where: { order_id: id },
    });
  }
}
