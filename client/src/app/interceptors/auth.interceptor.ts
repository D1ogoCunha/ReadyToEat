import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
  
    
    let currentUser = JSON.parse(localStorage.getItem('auth-token') || "{}");

    if (currentUser && currentUser.token) {
      request = request.clone({
          setHeaders: { 
              "x-access-token": `${currentUser.token}`
          }
      });
  }
    
    return next.handle(request);
  }
  
}
