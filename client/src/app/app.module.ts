import { NgModule } from '@angular/core';
/*import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { routes } from './app.routes';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { DishesComponent } from './pages/dishes/dishes.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CartService } from './services/cart.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
*/
@NgModule({
  /*declarations: [
    AppComponent,
    LoginComponent,
    RestaurantsComponent,
    DishesComponent,
    ShoppingCartComponent,
  ],*/
  imports: [
   /* BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),*/
  ],
  providers: [
    /*CartService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  */
  ], 
  //bootstrap: [AppComponent],
})
export class AppModule {}
