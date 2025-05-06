import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './pages/restaurant-menus/restaurant-menus.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: 'dishes', component: DishesComponent },
  { path: 'restaurants', component: RestaurantsComponent },
  {
    path: 'restaurants/:restaurantId/menus',
    component: RestaurantMenusComponent,
  },
  { path: 'menus/:menuId/dishes', component: DishesComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
];
