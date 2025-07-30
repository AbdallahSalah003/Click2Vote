import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class SetAccessTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        const accessToken = data?.accessToken;
        if (accessToken) {
          const [header, payload, signature] = accessToken.split('.');
          response.cookie('jwt_hp', `${header}.${payload}`, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
          });
          response.cookie('jwt_sig', signature, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });

          delete data.accessToken;
        }
      }),
    );
  }
}
