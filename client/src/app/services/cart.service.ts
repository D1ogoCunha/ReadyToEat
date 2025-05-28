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

  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItems.asObservable();

  constructor(private toastr: ToastrService) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartCount.next(this.cart.length);
      this.cartItems.next(this.cart);
    }
  }

  addToCart(dish: any, restaurantId: string) {
    if (this.cart.length > 0 && this.cart[0].restaurantId !== restaurantId) {
      this.toastr.error('You can only add items from the same restaurant to the cart.');
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

  getCartItems() {
    if (!this.cart.length) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
        this.cartItems.next(this.cart);
        this.cartCount.next(this.cart.length);
      }
    }
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
}
