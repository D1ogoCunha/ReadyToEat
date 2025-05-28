import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar.component'; 
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

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
  chart: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getChart().subscribe({
      next: (data) => {
        this.chartData = data;
        this.createChart();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar estatísticas.';
      }
    });
  }

createChart() {
  if (this.chart) {
    this.chart.destroy();
  }

  const labels = this.chartData.map((item: any) => item.name);
  const values = this.chartData.map((item: any) => item.count);

  const ctx = document.getElementById('mostOrderedDishesChart') as HTMLCanvasElement;
  if (ctx) {
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Pedidos',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
}