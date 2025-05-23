import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0;
  user: User | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });

    this.userService.user$.subscribe((user: User) => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}