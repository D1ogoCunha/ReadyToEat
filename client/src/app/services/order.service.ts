import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
   private apiUrl = 'http://localhost:3000/api/orders';
  constructor(private http: HttpClient) {}

  createOrder(order: any) {
    return this.http.post('http://localhost:3000/api/orders', order);
  }
    getCustomerOrders(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?customerId=${customerId}`);
  }
}
