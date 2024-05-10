import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: "", component: ProductsComponent },
  { path: "men", component: ProductsComponent },
  { path: "women", component: ProductsComponent },
  { path: "jewelry", component: ProductsComponent },
  { path: "electronics", component: ProductsComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "product/:productId", component: ProductDetailComponent }
];
