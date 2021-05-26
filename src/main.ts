import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validación para los diferentes campos
  app.useGlobalPipes(new ValidationPipe());

  // Setup de Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend-API')
    .setDescription('Description of API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  // Habilitar CORS
  app.enableCors();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
