import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})

export class CartService {
  private cart: any[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<any[]>([]);
  private userId: string | null = null;

  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItems.asObservable();

  constructor(private toastr: ToastrService) {
    this.setUserIdFromToken();
    this.loadCart();
  }

  private setUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload._id;
      } catch {
        this.userId = null;
      }
    }
  }

  private getCartKey(): string {
    return this.userId ? `cart_${this.userId}` : 'cart_guest';
  }

  private loadCart() {
    const savedCart = localStorage.getItem(this.getCartKey());
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.cartCount.next(this.cart.length);
    this.cartItems.next(this.cart);
  }

  private updateCartState() {
    localStorage.setItem(this.getCartKey(), JSON.stringify(this.cart));
    this.cartCount.next(this.cart.length);
    this.cartItems.next(this.cart);
  }

  addToCart(dish: any, restaurantId: string) {
    if (this.cart.length > 0 && this.cart[0].restaurantId !== restaurantId) {
      this.toastr.error(
        'You can only add items from the same restaurant to the cart.'
      );
      return;
    }

    const existingItem = this.cart.find((item) => item._id === dish._id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      dish.quantity = 1;
      dish.restaurantId = restaurantId;
      this.cart.push(dish);
    }
    this.updateCartState();
  }

  clearCart() {
    this.cart = [];
    this.updateCartState();
  }

  updateCartItem(updatedItem: any) {
    const index = this.cart.findIndex((item) => item._id === updatedItem._id);
    if (index !== -1) {
      this.cart[index] = updatedItem;
      this.updateCartState();
    }
  }

  removeCartItem(itemId: string): void {
    this.cart = this.cart.filter((item) => item._id !== itemId);
    this.updateCartState();
  }

  public onUserChanged() {
    this.setUserIdFromToken();
    this.loadCart();
  }
}
