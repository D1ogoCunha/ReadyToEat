import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          // Successful login, AuthService handles token storage and currentUser update
          // Navigate to a default route or a returnUrl if available
          console.log('Login successful', response);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage =
            err.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
  }
}
