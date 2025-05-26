/*import { Injectable } from '@angular/core';
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
    localStorage.removeItem('user');
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
}*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './user.service';

interface DecodedToken {
  email: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverApiUrl = 'http://localhost:3000';
  private tokenKey = 'authToken';

  private currentUserSubject: BehaviorSubject<DecodedToken | null>;
  public currentUser: Observable<DecodedToken | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService  
  ) {
    let initialUser: DecodedToken | null = null;
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        initialUser = jwtDecode<DecodedToken>(token);
        if (initialUser.exp * 1000 < Date.now()) {
          initialUser = null;
          localStorage.removeItem(this.tokenKey);
        }
      } catch (e) {
        console.error("Error decoding token on init:", e);
        localStorage.removeItem(this.tokenKey);
      }
    }
    this.currentUserSubject = new BehaviorSubject<DecodedToken | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string, password: string }): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(`${this.serverApiUrl}/login`, { ...credentials, rest: true }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          try {
            const decodedToken = jwtDecode<DecodedToken>(response.token);
            this.currentUserSubject.next(decodedToken);
          } catch (e) {
            console.error("Error decoding token on login:", e);
            this.currentUserSubject.next(null);
          }
        }
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userService.setUser(response.user); 
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.userService.clearUser(); 
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }

  register(userData: any): Observable<any> {
  return this.http.post<any>(
    `${this.serverApiUrl}/register`,
    { ...userData, rest: true }
  );
}
}
