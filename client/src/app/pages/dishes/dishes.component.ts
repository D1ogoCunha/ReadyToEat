import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { MenusService } from '../../services/menus.service';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  providers: [CartService],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  dishes: any[] = [];
  menuId!: string;
  restaurantId!: string; 

  constructor(
    private route: ActivatedRoute,
    private menusService: MenusService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const menuId = params.get('menuId');
      if (menuId) {
        this.menuId = menuId;
        this.menusService.getDishesByMenuId(menuId).subscribe({
          next: (dishes: any[]) => {
            this.dishes = dishes;
          },
          error: (err: any) => {
            console.error('Error searching for dishes:', err);
          }
        });
      }
    });
  }

  addToCart(dish: any) {
    this.menusService.getMenuById(this.menuId).subscribe({
      next: (menu: any) => {
        this.cartService.addToCart(dish, menu.createdBy); 
        alert(`${dish.nome} was successfully added to your cart!`);
      },
      error: () => alert('An error occurred while retrieving the restaurant for this dish.')
    });
  }
}