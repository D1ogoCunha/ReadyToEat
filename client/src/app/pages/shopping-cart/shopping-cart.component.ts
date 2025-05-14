import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  shippingCost: number = 10;

  constructor(private cartService: CartService, private router: Router) {}

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
    const taxRate = 0.1; // 10% de imposto
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
    alert('Proceeding to checkout...');
  }
}