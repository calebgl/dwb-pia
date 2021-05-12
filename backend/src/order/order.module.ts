import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [PrismaModule, DishModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
