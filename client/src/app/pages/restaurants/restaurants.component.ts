import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: any[] = [];

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => this.restaurants = data,
      error: (err) => console.error(err)
    });
  }
}
