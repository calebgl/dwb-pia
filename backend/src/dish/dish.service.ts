import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ThrowNotFoundException } from 'src/utils/utils';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(private prismaService: PrismaService) {}

  async create(createDishDto: CreateDishDto) {
    const { dish_name, dish_price, quantity, dish_image } = createDishDto;

    return await this.prismaService.dish.create({
      data: {
        dish_name,
        dish_price: new Decimal(dish_price).toFixed(2),
        quantity: quantity,
        dish_image,
      },
    });
  }

  async findAll() {
    return await this.prismaService.dish.findMany({
      orderBy: { dish_id: 'desc' },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.dish.findUnique({
      where: { dish_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Platillo no encontrado'),
    });
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    const dish = await this.findOne(id);

    dish.dish_name = updateDishDto.dish_name ?? dish.dish_name;
    dish.dish_price = updateDishDto.dish_price ?? dish.dish_price;
    dish.quantity = updateDishDto.quantity ?? dish.quantity;
    dish.dish_image = updateDishDto.dish_image ?? dish.dish_image;

    return await this.prismaService.dish.update({
      where: { dish_id: id },
      data: {
        dish_name: dish.dish_name,
        dish_price: new Decimal(dish.dish_price).toFixed(2),
        quantity: dish.quantity,
        dish_image: dish.dish_image,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.dish.delete({ where: { dish_id: id } });
  }
}
