import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const port = process.env.PORT;  
  const app = await NestFactory.create(AppModule);

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
  await app.listen(port);
}
bootstrap();