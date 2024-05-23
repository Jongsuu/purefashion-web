import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { fadeInMenu } from '../animations';
import { CartService } from '../services/cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { catchError, throwError } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [fadeInMenu]
})
export class NavbarComponent implements OnInit {
  links = [
    {
      name: "Men's clothing",
      href: "/men"
    },
    {
      name: "Women's clothing",
      href: "/women"
    },
    {
      name: "Jewelry",
      href: "/jewelry"
    },
    {
      name: "Electronics",
      href: "/electronics"
    }
  ];

  showUserMenu = false;

  @Output() isDarkMode = new EventEmitter<boolean>();

  @Input() currentThemeIsDark = false;

  constructor(public auth: AuthService, public cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.user$) {
      this.getCartIndicator();
    }
  }

  public toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  public toggleTheme(): void {
    this.isDarkMode.emit(!this.currentThemeIsDark);
    this.showUserMenu = false;
  }

  public navigateToLogin(): void {
    this.router.navigateByUrl("/login");
    this.showUserMenu = false;
  }

  public logout(): void {
    this.auth.logout();
    this.showUserMenu = false;
  }

  private handleCartIndicatorError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoActionResponse<number>;

      return throwError(() => new Error(response.message));
    }
    catch (ex) {
      return throwError(() => ex);
    }
  }

  private getCartIndicator(): void {
    this.cartService.getCartItemsCount().pipe(catchError(this.handleCartIndicatorError.bind(this))).subscribe(response => {
      this.cartService.cartCount$.next(response.data);
    });
  }
}
