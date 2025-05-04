import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent {
  menus = [
    {
      id: 1,
      name: 'Menu 1',
      description: 'Description for Menu 1',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Menu 2',
      description: 'Description for Menu 2',
      image: 'https://via.placeholder.com/150'
    }
  ];
}