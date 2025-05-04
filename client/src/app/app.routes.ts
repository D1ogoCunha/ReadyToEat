import { Routes } from '@angular/router';
import { MenusComponent } from './pages/menus/menus.component';
import { DishesComponent } from './pages/dishes/dishes.component';

export const routes: Routes = [
    { path: 'dishes', component: DishesComponent },
    { path: 'menus', component: MenusComponent },
    { path: '', redirectTo: '/shop', pathMatch: 'full' }
];
