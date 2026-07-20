/**
 * Global exception filter.
 * Menangkap semua exception (HttpException dan unknown) dan mengembalikan
 * response error terstruktur: { success, statusCode, message, data: null, timestamp }.
 * Error messages dari validation pipes (array) diambil elemen pertamanya saja.
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/** Kelas HttpExceptionFilter. */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
     * Mengeksekusi operasi catch.
     * @param exception Parameter input.
     * @param host Parameter input.
     * @returns Hasil dari operasi catch.
     */
    catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const errorMessage =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message ||
          JSON.stringify(exceptionResponse)
        : (exception as any).message || 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
