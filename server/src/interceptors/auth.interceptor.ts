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
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), 
            domain: '127.0.0.1',
            path: '/',
          });
          response.cookie('jwt_sig', signature, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), 
            domain: '127.0.0.1', 
            path: '/',
          });

          delete data.accessToken;
        }
      }),
    );
  }
}
