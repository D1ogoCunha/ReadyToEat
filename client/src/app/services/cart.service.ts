import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<any[]>([]); 
  
  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItems.asObservable(); 

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartCount.next(this.cart.length);
      this.cartItems.next(this.cart);
    }
  }

  addToCart(dish: any) {
    this.cart.push(dish);
    this.updateCartState();
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.updateCartState();
  }

  private updateCartState() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartCount.next(this.cart.length);
    this.cartItems.next(this.cart);
  }
}