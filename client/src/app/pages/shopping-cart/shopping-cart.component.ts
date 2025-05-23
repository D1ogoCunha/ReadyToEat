import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  shippingCost: number = 10;

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cartItems = this.cartService.getCartItems();
      });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.preco * (item.quantity || 1),
      0
    );
  }

  calculateTax(): number {
    const taxRate = 0.1; 
    return this.calculateSubtotal() * taxRate;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax() + this.shippingCost;
  }

  increaseQuantity(item: any): void {
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCartItem(item);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateCartItem(item);
    }
  }

  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter(
      (cartItem) => cartItem._id !== item._id
    );
    this.cartService.removeCartItem(item._id);
  }

  proceedToCheckout(): void {
    let customerId: string | undefined;
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        customerId = decoded._id;
      } catch {
        customerId = undefined;
      }
    }
    if (!customerId) {
      alert('You need to be authenticated to order.');
      return;
    }
    if (!this.cartItems.length) {
      alert('The cart is empty.');
      return;
    }

    const restaurantId = this.cartItems[0].restaurantId;
    const dishes = this.cartItems.map(item => item._id);
    const amount = this.calculateSubtotal();

    const order = { restaurantId, customerId, amount, dishes };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('Order created successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: () => alert('Error creating order!')
    });
  }
}