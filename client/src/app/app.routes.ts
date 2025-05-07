import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './pages/restaurant-menus/restaurant-menus.component';
import { LoginComponent } from './auth/login/login.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';

export const routes: Routes = [
  { path: 'dishes', component: DishesComponent },
  { path: 'dishes/:dishId/details', component: DishDetailsComponent },
  { path: 'restaurants', component: RestaurantsComponent },
  {
    path: 'restaurants/:restaurantId/menus',
    component: RestaurantMenusComponent,
  },
  { path: 'menus/:menuId/dishes', component: DishesComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
];
