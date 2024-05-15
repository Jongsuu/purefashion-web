import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { dtoProductCartData } from '../../interfaces/product.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { slightFadeIn } from '../animations';
import { AuthService } from '../services/auth.service';

const PAGESIZE = 5;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    PaginationComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  animations: [slightFadeIn]
})
export class CartComponent implements OnInit {

  products: dtoProductCartData[] = [];
  resultsCount = 0;
  isLoading = true;

  nProducts = [...Array(PAGESIZE).keys()];

  currentPage = 0;
  totalPages = 0;
  pageSize = PAGESIZE;

  constructor(private authService: AuthService, private cartService: CartService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.getCartProducts();
  }

  private getCartProducts(): void {
    const filter: dtoPaginationFilter = {
      pageIndex: this.currentPage,
      pageSize: PAGESIZE
    };

    this.cartService.getProductsFromCart(filter)
      .pipe(catchError(this.handleGetCartProductsError.bind(this)))
      .subscribe(response => {
        setTimeout(() => {
          this.products = response.data;
          this.resultsCount = response.resultsCount;
          this.totalPages = Math.ceil(response.resultsCount / PAGESIZE);
          this.isLoading = false;
        }, 100);
      });
  }

  private handleGetCartProductsError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoListResponse<dtoProductCartData>;

      // Unauthorized
      if (error.status === 401) {
        this.toast.errorToast("You need to log in!");
        this.router.navigateByUrl("/login");
        return throwError(() => new Error(response.message));
      }

      if (response && response.message)
        this.toast.errorToast(response.message);
      else
        this.toast.errorToast("Unexpected error when fetching cart products");

      return throwError(() => new Error(response.message));
    }
    catch (ex) {
      return throwError(() => ex);
    }
  }

  public onGoToPage(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getCartProducts();
  }

  public onPrevious(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getCartProducts();
  }

  public onNext(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getCartProducts();
  }

  public removeFromCart(product: dtoProductCartData): void {
    this.cartService.removeFromCart(product.productId).pipe(catchError(this.handleCartError.bind(this))).subscribe(response => {
      if (response.data) {
        this.toast.successToast(`<b>${product.name.length >= 35 ? product.name.substring(0, 32) + "..." : product.name}</b> was removed from Shopping Cart`);
        this.products = this.products.filter(item => item.productId !== product.productId);
        this.resultsCount--;
        this.totalPages = Math.ceil(this.resultsCount / PAGESIZE);
      }
    });
  }

  private handleCartError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoActionResponse<boolean>;

      if (response && response.message)
        this.toast.errorToast(response.message);
      else
        this.toast.errorToast("There was an unexpected error");

      return throwError(() => new Error(response.message));
    }
    catch (ex) {
      return throwError(() => ex);
    }
  }
}
