import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  constructor(
    private route: ActivatedRoute,
    private menusService: MenusService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const menuId = params.get('menuId');
      if (menuId) {
        this.menuId = menuId;

        this.menusService.getDishesByMenuId(menuId).subscribe({
          next: (dishes: any[]) => {
            this.dishes = dishes;
            this.dishes.forEach(dish =>
              console.log(`Prato: ${dish.nome}, Imagem: ${dish.imagem}`)
            );
          },
          error: (err: any) => {
            console.error('Erro ao buscar pratos:', err);
          }
        });
      }
    });
  }

  addToCart(dish: any) {
    this.cartService.addToCart(dish);
    alert(`${dish.nome} foi adicionado ao carrinho!`);
  }
}