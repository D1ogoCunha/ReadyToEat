import { Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';

export const routes: Routes = [
    { path: 'dishes', component: DishesComponent },
    { path: 'restaurants', component: RestaurantsComponent },
    { path: '', redirectTo: '/restaurants', pathMatch: 'full' }
];
