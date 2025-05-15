import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; 
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, { email, password }).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, userData);
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token set:', token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}