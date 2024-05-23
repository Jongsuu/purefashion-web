import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ToastrComponent } from './toastr/toastr.component';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegisterComponent,
    ToastrComponent,
    NavbarComponent,
    ProductsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isDarkMode = false;
  userLogged = false;

  constructor(public router: Router, private auth: AuthService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(item => {
      if (!item)
        this.userLogged = false;
      else
        this.userLogged = true;
    });

    let sessionTheme = sessionStorage.getItem("theme");
    let darkMode: boolean;
    if (sessionTheme)
      darkMode = sessionTheme === "dark";
    else {
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkMode = darkModeMediaQuery.matches;
    }

    this.changeTheme(darkMode);
  }

  changeTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.theme.changeTheme(isDark);
  }
}
