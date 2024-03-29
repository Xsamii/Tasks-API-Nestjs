import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TransformInterceptor } from './transform.interceptor';
async function bootstrap() {
  dotenv.config({
    path: '../.env.stage.dev',
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(+process.env.port, () => {
    console.log(`server is running on port ${+process.env.port}`);
  });
}
bootstrap();
