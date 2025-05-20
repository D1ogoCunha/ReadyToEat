import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component'; 
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-profile-chart',
  templateUrl: './profile-chart.component.html',
  styleUrls: ['./profile-chart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent]
})
export class ProfileChartComponent implements OnInit {
  chartData: any;
  errorMessage = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getChart().subscribe({
      next: (data) => {
        this.chartData = data;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar estatísticas.';
      }
    });
  }
}