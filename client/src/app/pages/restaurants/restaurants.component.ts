import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule], // Add FormsModule
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  selectedSort: string = '';
  selectedCategory: string = '';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        console.log('Restaurants received:', data);
        this.restaurants = data;
        this.filteredRestaurants = data; // Initialize filtered list
      },
      error: (err) => console.error('Error loading restaurants:', err)
    });
  }

    applyFilters(): void {
    let filtered = [...this.restaurants];
  
    // Sort by price
    if (this.selectedSort === 'priceLowToHigh') {
      filtered.sort((a, b) => Number(a.pricePerPerson) - Number(b.pricePerPerson));
    } else if (this.selectedSort === 'priceHighToLow') {
      filtered.sort((a, b) => Number(b.pricePerPerson) - Number(a.pricePerPerson));
    }
  
    this.filteredRestaurants = filtered;
  }
}