import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();

  const port = process.env.PORT;  
  const app = await NestFactory.create(AppModule);

  // Start microservices
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'products',
      protoPath: join(__dirname, "protos/product.proto"),
      url: 'localhost:50051',
    },
  });

  // Enable CORS
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('Product-Management')
    .setDescription('APIs for Product Management System')
    .setVersion('1.0')
    .addTag('product-management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs-product-api', app, document);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Start all microservices and listen on the HTTP server
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
