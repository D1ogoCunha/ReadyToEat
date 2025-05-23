import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { DishesService } from '../../services/dishes.service';
import { MenusService } from '../../services/menus.service';

@Component({
  selector: 'app-dish-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit {
  dish: any;

  constructor(
    private route: ActivatedRoute,
    private dishesService: DishesService,
    private cartService: CartService,
    private menusService: MenusService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const dishId = params.get('dishId');
      if (dishId) {
        this.dishesService.getDishById(dishId).subscribe({
          next: (dish: any) => {
            this.dish = dish;
          },
          error: (err: any) => {
            console.error('Error searching for dish:', err);
          }
        });
      }
    });
  }

  addToCart(): void {
    if (this.dish && this.dish.menu) {
      this.menusService.getMenuById(this.dish.menu).subscribe({
        next: (menu: any) => {
          this.cartService.addToCart(this.dish, menu.createdBy); 
          alert(`${this.dish.nome} was successfully added to your cart!`);
        },
        error: () => alert('An error occurred while retrieving the restaurant for this dish.')
      });
    }
  }
}