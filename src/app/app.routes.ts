import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  { path: "", component: ProductsComponent },
  { path: "men", component: ProductsComponent },
  { path: "women", component: ProductsComponent },
  { path: "jewelry", component: ProductsComponent },
  { path: "electronics", component: ProductsComponent },
  { path: "cart", component: CartComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "product/:productId", component: ProductDetailComponent },
  { path: "orders", component: OrdersComponent },
];
