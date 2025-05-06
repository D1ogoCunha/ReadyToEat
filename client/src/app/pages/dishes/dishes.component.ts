import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dishes.component.html',
})
export class DishesComponent implements OnInit {
  dishes: any[] = [];
  menuId!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const menuId = params.get('menuId');
      if (menuId) {
        this.menuId = menuId;
        this.http.get<any[]>(`http://localhost:3000/api/menus/${menuId}/dishes`).subscribe({
          next: (dishes: any[]) => {
            this.dishes = dishes;
          },
          error: (err: any) => {
            console.error('Erro ao buscar pratos:', err);
          }
        });
      }
    });
  }
}