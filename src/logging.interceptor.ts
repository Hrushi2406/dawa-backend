import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { log } from 'console';
import { catchError, map, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = new Logger();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => logger.log(`Response time: ${Date.now() - now}ms`)),
      catchError((err) => {
        logger.error(`Error: ${err.message}`);
        logger.log(`Response time: ${Date.now() - now}ms`);
        return throwError(() => err);
      }),
    );
  }
}
