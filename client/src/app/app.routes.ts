import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './pages/restaurant-menus/restaurant-menus.component';
import { LoginComponent } from './auth/login/login.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AuthGuard } from './guards/auth.guard';  

export const routes: Routes = [
  { path: 'dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'dishes/:dishId/details', component: DishDetailsComponent, canActivate: [AuthGuard] },
  { path: 'restaurants', component: RestaurantsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  {path: 'restaurants/:restaurantId/menus', component: RestaurantMenusComponent, canActivate: [AuthGuard]},
  { path: 'menus/:menuId/dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
];
