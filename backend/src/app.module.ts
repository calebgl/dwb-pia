import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { DishModule } from './dish/dish.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AuthModule, EmployeeModule, DishModule, OrderModule],
  // controllers: [AppController],
  // providers: [AppService, PrismaService],
})
export class AppModule {}
