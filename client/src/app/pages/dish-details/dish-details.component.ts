import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dish-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit {
  dish: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const dishId = params.get('dishId');
      if (dishId) {
        this.http.get<any>(`http://localhost:3000/api/dishes/${dishId}`).subscribe({
          next: (dish: any) => {
            this.dish = dish;
          },
          error: (err: any) => {
            console.error('Error searching for dish:', err);
          }
        });
      }
    });
  }
}
