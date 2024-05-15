import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { fadeInMenu } from '../animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [fadeInMenu]
})
export class NavbarComponent {
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

  constructor(public auth: AuthService, private router: Router) { }

  public toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  public toggleTheme(): void {
    this.isDarkMode.emit(!this.currentThemeIsDark);
  }

  public navigateToLogin(): void {
    this.router.navigateByUrl("/login");
  }

  public logout(): void {
    this.auth.logout();
  }
}
