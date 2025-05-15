import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { routes } from './app.routes';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { DishesComponent } from './pages/dishes/dishes.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CartService } from './services/cart.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RestaurantsComponent,
    DishesComponent,
    ShoppingCartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [CartService],
  bootstrap: [AppComponent],
})
export class AppModule {}
