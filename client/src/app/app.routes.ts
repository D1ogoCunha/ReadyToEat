import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantMenusComponent } from './pages/restaurant-menus/restaurant-menus.component';

export const routes: Routes = [
    { path: 'dishes', component: DishesComponent },
    { path: 'restaurants', component: RestaurantsComponent },
    { path: 'restaurants/:restaurantId/menus', component: RestaurantMenusComponent },
    { path: '', redirectTo: '/restaurants', pathMatch: 'full' }
];
