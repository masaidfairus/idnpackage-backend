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
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://idnpackage.vercel.app',
    // Vercel production domain (set CORS_ORIGIN env var in Railway to override)
    ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    // Allow ALL Vercel preview deployments for this project
    /^https:\/\/idnpackage-.*\.vercel\.app$/,
    /^https:\/\/idnpackage-.*\.projects\.vercel\.app$/,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
