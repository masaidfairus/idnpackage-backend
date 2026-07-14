/**
 * Entry point aplikasi NestJS.
 * - Mengaktifkan CORS
 * - Global ValidationPipe (whitelist + forbidNonWhitelisted)
 * - Global TransformInterceptor (membungkus response ke format { success, statusCode, message, data, timestamp })
 * - Global HttpExceptionFilter (menangani error terstruktur)
 * - Port default 3000 jika env PORT tidak diset
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
