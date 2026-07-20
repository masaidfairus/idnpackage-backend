/**
 * Global response interceptor.
 * Membungkus semua response sukses ke format:
 * { success: true, statusCode, message, data, timestamp }.
 * - Jika handler mengembalikan { data, message }, maka `data.data` diekstrak dan `message` dipakai.
 * - Jika handler mengembalikan objek biasa, seluruhnya menjadi `data`.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/** Antarmuka Response. */
export interface Response<T> {
  /** Properti success. */
    success: boolean;
  /** Properti statusCode. */
    statusCode: number;
  /** Properti message. */
    message: string;
  /** Properti data. */
    data: T;
  /** Properti timestamp. */
    timestamp: string;
}

/** Kelas TransformInterceptor menangani logika bisnis. */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  /**
     * Mengeksekusi operasi intercept.
     * @param context Parameter input.
     * @param next Parameter input.
     * @returns Hasil dari operasi intercept.
     */
    intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: statusCode,
        message: data?.message || 'Request processed successfully',
        data: data?.data !== undefined ? data.data : data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
