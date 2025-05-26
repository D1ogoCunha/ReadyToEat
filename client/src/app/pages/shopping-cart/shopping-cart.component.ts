import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  shippingCost: number = 10;
  paymentOption: string = '';
  deliveryAddress: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartService['cart'] = JSON.parse(storedCart);
      this.cartService['cartItems'].next(this.cartService['cart']);
      this.cartService['cartCount'].next(this.cartService['cart'].length);
    }

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
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
    const dishes = this.cartItems.map((item) => item._id);
    const amount = this.calculateSubtotal();

    const order = { restaurantId, customerId, amount, dishes };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('Order created successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: () => alert('Error creating order!'),
    });
  }
  confirmPayment(): void {
    if (this.paymentOption === 'courier' && !this.deliveryAddress) {
      alert('Please enter a delivery address.');
      return;
    }

    const customerId = this.getCustomerId();
    if (!customerId) {
      alert('You need to be authenticated to order.');
      return;
    }

    const restaurantId = this.cartItems[0].restaurantId;
    const dishes = this.cartItems.map((item) => item._id);
    const amount = this.calculateSubtotal();

    const order = {
      restaurantId,
      customerId,
      amount,
      dishes,
      paymentOption: this.paymentOption,
      deliveryAddress:
        this.paymentOption === 'courier' ? this.deliveryAddress : null,
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        const modalElement = document.getElementById('paymentModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        alert('Order created successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: () => alert('Error creating order!'),
    });
  }

  openPaymentModal(): void {
    const modalElement = document.getElementById('paymentModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  private getCustomerId(): string | undefined {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded._id;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
