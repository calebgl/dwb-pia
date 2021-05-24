import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ThrowMethodNotAllowedException,
  ThrowNotFoundException,
} from 'src/utils/utils';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(private prismaService: PrismaService) {}

  // Crea un platillo en la base de datos para
  // después mostrarlo en la petición.
  // No pueden existir más de 50 platillos a
  // la vez.
  async create(createDishDto: CreateDishDto) {
    if ((await this.findAll()).length > 50)
      ThrowMethodNotAllowedException(
        'La cantidad de platillos alcanzó su límite',
      );

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

  // Busca los diferentes platillos registrados en
  // la base de datos y los ordena de manera ascendente
  // en base al id para posteriormente mostrarlos en
  // la petición.
  async findAll() {
    return await this.prismaService.dish.findMany({
      orderBy: { dish_id: 'asc' },
    });
  }

  // Busca un platillos según el id proporcionado
  // para posteriormente mostrarlo en la petición.
  // En el caso de no ser encontrado lanza una
  // excepción de no encontrado.
  async findOne(id: number) {
    return await this.prismaService.dish.findUnique({
      where: { dish_id: id },
      rejectOnNotFound: () => ThrowNotFoundException('Platillo no encontrado'),
    });
  }

  // Actualiza un platillo en la base de datos
  // según el id proporcionado y lo regresa
  // para mostrarlo en la petición
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

  // Elimina un platillo en la base de datos
  // según el id proporcionado y lo regresa
  // para mostrarlo en la petición
  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.dish.delete({ where: { dish_id: id } });
  }
}
