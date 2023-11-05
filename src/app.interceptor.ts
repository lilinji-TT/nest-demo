import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AppInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      // tap 操作符，不会改变逻辑，只是执行一段逻辑
      tap(() => {
        this.logger.log(`当前接口耗时: ${Date.now() - now}ms`);
      }),
    );
  }
}
