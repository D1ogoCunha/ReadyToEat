import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './pages/restaurant-menus/restaurant-menus.component';
import { OrderComponent } from './pages/order/order.component';
import { LoginComponent } from './auth/login/login.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { ProfileEditComponent } from './pages/user/profile-edit/profile-edit.component';
import { ProfileSecurityComponent } from './pages/user/profile-security/profile-security.component';
import { ProfileChartComponent } from './pages/user/profile-chart/profile-chart.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'dishes/:dishId/details', component: DishDetailsComponent, canActivate: [AuthGuard] },
  { path: 'restaurants', component: RestaurantsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'restaurants/:restaurantId/menus', component: RestaurantMenusComponent, canActivate: [AuthGuard] },
  { path: 'menus/:menuId/dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'user/profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/security', component: ProfileSecurityComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/chart', component: ProfileChartComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
