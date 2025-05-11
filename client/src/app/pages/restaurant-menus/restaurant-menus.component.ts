import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-restaurant-menus',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './restaurant-menus.component.html',
  styleUrls: ['./restaurant-menus.component.css']
})
export class RestaurantMenusComponent implements OnInit {
  menus: any[] = [];
  restaurantId!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const restaurantId = params.get('restaurantId');
      if (restaurantId) {
        this.http.get<any[]>(`http://localhost:3000/api/restaurants/${restaurantId}/menus`).subscribe({
          next: (menus: any[]) => {
            this.menus = menus;
          },
          error: (err: any) => {
          }
        });
      }
    });
  }
}