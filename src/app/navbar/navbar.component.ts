import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
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
      name: "Man",
      href: "/man"
    },
    {
      name: "Woman",
      href: "/woman"
    },
    {
      name: "Child",
      href: "/child"
    }
  ];

  showUserMenu = false;

  constructor(public auth: AuthService) { }

  public toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  public logout(): void {
    this.auth.logout();
  }
}
