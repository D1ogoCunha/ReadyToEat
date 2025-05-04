import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule, // Adicionar FormsModule aqui
    HttpClientModule,
    RouterModule.forRoot(routes),
    LoginComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
