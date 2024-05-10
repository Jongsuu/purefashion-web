import { Component, OnInit, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ToastrComponent } from './toastr/toastr.component';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';

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

  constructor(public router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(item => {
      if (!item) {
        // this.router.navigateByUrl("/login");
        this.userLogged = false;
      }
      else {
        this.userLogged = true;
      }
    });
  }

  changeTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
  }
}
