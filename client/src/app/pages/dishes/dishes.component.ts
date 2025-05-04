import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dishes.component.html',
})
export class DishesComponent {

}
