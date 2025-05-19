import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'currentUser';

  constructor(private http: HttpClient) {}

 login(email: string, password: string): Observable<any> {
  const url = `${this.apiUrl}/login`;
  return this.http.post(url, { email, password, rest: true }).pipe(
    tap((response: any) => {
      if (response && response.token) {
        this.setToken(response.token);
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
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
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    document.cookie = `auth-token=${token}; path=/;`;
  }

  getToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )auth-token=([^;]+)'));
    return match ? match[2] : null;
  }

  private clearToken(): void {
    document.cookie = 'auth-token=; Max-Age=0; path=/;';
  }
}
