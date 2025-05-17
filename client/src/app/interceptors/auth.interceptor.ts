import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor ativo!');

    // Verifica se o cookie "authToken" existe
    const hasAuthCookie = document.cookie.split(';').some(cookie => cookie.trim().startsWith('auth-token='));

    if (hasAuthCookie) {
      console.log('authToken encontrado nos cookies.');
      const cloned = request.clone({ withCredentials: true });
      return next.handle(cloned);
    } else {
      console.warn('authToken não encontrado nos cookies. Requisição original será usada.');
      return next.handle(request);
    }
  }
}
