import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  providers: [OrderService, AuthService],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  reviewComment: string = '';
  reviewImage: File | null = null;
  reviewOrderId: string | null = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      this.orderService.getCustomerOrders(user._id).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  openReviewModal(order: any) {
    this.reviewOrderId = order._id;
    this.reviewComment = '';
    this.reviewImage = null;
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  onFileSelected(event: any) {
    this.reviewImage = event.target.files[0] || null;
  }

  submitReview() {
    if (!this.reviewOrderId) return;
    const formData = new FormData();
    formData.append('comment', this.reviewComment);
    if (this.reviewImage) {
      formData.append('image', this.reviewImage);
    }
    this.orderService.submitReview(this.reviewOrderId, formData).subscribe({
      next: () => {
        alert('Avaliação enviada!');
      },
      error: () => alert('Erro ao enviar avaliação!')
    });
  }
}
