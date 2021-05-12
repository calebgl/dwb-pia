import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule, EmployeeModule],
  // controllers: [AppController],
  // providers: [AppService, PrismaService],
})
export class AppModule {}
