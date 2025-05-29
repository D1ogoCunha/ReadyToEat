/*import { Injectable } from '@angular/core';
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
}*/
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let clonedRequest = request;

    // console.log(`AuthInterceptor: Intercepting request to ${request.url}.`);

    // Add Authorization header only for requests to your API, not external APIs
    // Example: if (request.url.startsWith(environment.apiUrl)) { ... }
    if (token) {
      // console.log(`AuthInterceptor: Token found, adding Authorization header.`);
      clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      // console.log(`AuthInterceptor: No token found.`);
    }
    // `withCredentials: true` is generally not needed when using Authorization headers for tokens.
    // It's for sending cookies with cross-origin requests.
    return next.handle(clonedRequest);
  }
}
