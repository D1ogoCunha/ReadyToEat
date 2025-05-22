import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

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

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) {}

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
    const customerId = localStorage.getItem('userId');
    if (!customerId) {
      alert('Precisa de estar autenticado para encomendar.');
      return;
    }
    if (!this.cartItems.length) {
      alert('O carrinho está vazio.');
      return;
    }
    const restaurantId = this.cartItems[0].restaurantId;
    const dishes = this.cartItems.map(item => item._id);
    const amount = this.calculateSubtotal();

    const order = { restaurantId, customerId, amount, dishes };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('Encomenda criada com sucesso!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: () => alert('Erro ao criar encomenda!')
    });
  }
}