import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../services/cart.service';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { dtoProductCartData } from '../../interfaces/product.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { slightFadeIn } from '../animations';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { OrdersService } from '../services/orders.service';

const PAGESIZE = 8;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    PaginationComponent,
    AsyncPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  animations: [slightFadeIn]
})
export class CartComponent implements OnInit {
  @ViewChild("cartSection") cartSectionRef!: ElementRef<HTMLElement>;

  products: dtoProductCartData[] = [];
  resultsCount = 0;
  isLoading = true;

  nProducts = [...Array(PAGESIZE).keys()];

  currentPage = 0;
  totalPages = 0;
  pageSize = PAGESIZE;

  constructor(private authService: AuthService, private cartService: CartService, private ordersService: OrdersService,
    private toast: ToastService, private router: Router, public themeService: ThemeService) { }

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
          this.cartService.cartCount$.next(response.resultsCount);
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
    this.cartSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getCartProducts();
  }

  public onPrevious(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.cartSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getCartProducts();
  }

  public onNext(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.cartSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getCartProducts();
  }

  public incrementQuantity(input: HTMLInputElement, productId: string): void {
    const product = this.products.find(item => item.productId === productId)!;
    if (product.quantity < 30) {
      product.quantity++;
      input.value = product.quantity.toString();
    }
  }

  public decrementQuantity(input: HTMLInputElement, productId: string): void {
    const product = this.products.find(item => item.productId === productId)!;
    if (product.quantity > 1) {
      product.quantity--;
      input.value = product.quantity.toString();
    }
  }

  public onChangeQuantity(input: HTMLInputElement, productId: string) {
    const product = this.products.find(item => item.productId === productId)!;
    let value = input.valueAsNumber;

    if (value > 30) {
      value = 30;
    }
    else if (value < 1) {
      value = 1;
    }

    product.quantity = value;
    input.value = value.toString();
  }

  public removeFromCart(product: dtoProductCartData): void {
    this.cartService.removeFromCart(product.productId)
      .pipe(catchError(this.handleCartError.bind(this)))
      .subscribe(response => {
        if (response.data) {
          this.toast.successToast(`<b>${product.name.length >= 35 ? product.name.substring(0, 32) + "..." : product.name}</b> was removed from Shopping Cart`);
          this.products = this.products.filter(item => item.productId !== product.productId);
          this.resultsCount--;
          if (this.products.length <= this.resultsCount && this.totalPages > 1)
            this.getCartProducts();
          this.totalPages = Math.ceil(this.resultsCount / PAGESIZE);
          this.cartService.cartCount$.next(this.resultsCount);
        }
      });
  }

  public buyProductNow(product: dtoProductCartData): void {
    this.ordersService.createOrder([{
      productId: product.productId,
      quantity: product.quantity
    }])
      .pipe(catchError(this.handleCartError.bind(this)))
      .subscribe(response => {
        if (response.data) {
          this.toast.successToast(`You've bought <b>${product.quantity} x ${product.name.length >= 35 ? product.name.substring(0, 32) + "..." : product.name}</b>!`);
          this.products = this.products.filter(item => item.productId !== product.productId);
          this.resultsCount--;
          if (this.products.length <= this.resultsCount && this.totalPages > 1)
            this.getCartProducts();
          this.totalPages = Math.ceil(this.resultsCount / PAGESIZE);
          this.cartService.cartCount$.next(this.resultsCount);
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
