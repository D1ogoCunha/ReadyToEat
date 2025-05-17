import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
private apiUrl = 'http://localhost:3000/menus';

  constructor(private http: HttpClient) { }

  getDishesByMenuId(menuId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${menuId}/dishes`, { withCredentials: true });
  }
}
