import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductsService } from '../services/products.service';
import { dtoProductEntity } from '../../interfaces/product.interface';
import { AsyncPipe, CurrencyPipe, DecimalPipe, I18nPluralPipe } from '@angular/common';
import { slightFadeIn } from '../animations';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';
import { ProductDetailReviewsComponent } from '../product-detail-reviews/product-detail-reviews.component';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ThemeService } from '../services/theme.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    I18nPluralPipe,
    NgxSkeletonLoaderModule,
    ProductDetailReviewsComponent,
    AsyncPipe
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  animations: [slightFadeIn]
})
export class ProductDetailComponent implements OnInit {

  @ViewChild("descriptionElem") descriptionRef!: ElementRef<HTMLParagraphElement>;

  isLoading = true;
  item: dtoProductEntity = {} as any;

  quantity = 1;
  showFullDescription = true;
  isDescriptionSmall = true;

  constructor(private route: ActivatedRoute, private router: Router, private responsive: BreakpointObserver,
    private authService: AuthService, private cartService: CartService, private ordersService: OrdersService,
    private productService: ProductsService, private toast: ToastService, public themeService: ThemeService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productId = routeParams.get("productId");

    this.productService.getProductById(productId ?? "").pipe(catchError(this.handleGetProductByIdError.bind(this))).subscribe(response => {
      this.item = response.data;
      this.isLoading = false;
      setTimeout(() => {
        let isSmall = this.getDescriptionLineCount() <= 4;
        this.showFullDescription = isSmall;
        this.isDescriptionSmall = isSmall;
      }, 50);
    });

    this.responsive.observe([
      Breakpoints.XLarge,
      Breakpoints.Large,
      "(max-width: 1500px)",
      Breakpoints.Medium,
      Breakpoints.Small,
      Breakpoints.XSmall,
      "(max-width: 400px)",
      "(max-width: 350px)",
      "(max-width: 300px)"
    ]).subscribe(() => {
      if (!this.isLoading) {
        let isSmall = this.getDescriptionLineCount() <= 4;
        this.showFullDescription = isSmall;
        this.isDescriptionSmall = isSmall;
      }
    });
  }

  private handleGetProductByIdError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoActionResponse<dtoProductEntity>;

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

  private handleCartError(error: HttpErrorResponse) {
    try {
      this.item.inCart = !this.item.inCart;
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

  public incrementQuantity(input: HTMLInputElement): void {
    if (this.quantity < 30) {
      this.quantity++;
      input.value = this.quantity.toString();
    }
  }

  public decrementQuantity(input: HTMLInputElement): void {
    if (this.quantity > 1) {
      this.quantity--;
      input.value = this.quantity.toString();
    }
  }

  public onChangeQuantity(input: HTMLInputElement) {
    let value = input.valueAsNumber;

    if (value > 30) {
      value = 30;
    }
    else if (value < 1) {
      value = 1;
    }

    this.quantity = value;
    input.value = value.toString();
  }

  public getDescriptionLineCount(): number {
    let descHeight = this.descriptionRef.nativeElement.offsetHeight
    let lineHeight = parseInt(window.getComputedStyle(this.descriptionRef.nativeElement).lineHeight);
    let lines = Math.round(descHeight / lineHeight);
    return lines;
  }

  public addToCart(): void {
    if (!this.authService.user$.value) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.item.inCart = true;
    this.cartService.addToCart(this.item.productId, this.quantity).pipe(catchError(this.handleCartError.bind(this))).subscribe(response => {
      this.item.inCart = response.data;

      if (response.data) {
        this.toast.successToast(`<b>${this.item.name.length >= 35 ? this.item.name.substring(0, 32) + "..." : this.item.name}</b> was added to Shopping Cart!`);
        this.cartService.cartCount$.next((this.cartService.cartCount$.value ?? 0) + 1);
      }
    });
  }

  public buyProductNow(): void {
    this.ordersService.createOrder([{
      productId: this.item.productId,
      quantity: this.quantity
    }])
      .pipe(catchError(this.handleCartError.bind(this)))
      .subscribe(response => {
        if (response.data) {
          this.toast.successToast(`You've bought <b>${this.quantity} x ${this.item.name.length >= 35 ? this.item.name.substring(0, 32) + "..." : this.item.name}</b>!`);
          if (this.item.inCart) {
            let cartCount = this.cartService.cartCount$.value ?? 0;
            this.cartService.cartCount$.next(cartCount > 0 ? cartCount - 1 : 0);
            this.item.inCart = false;
          }
        }
      });
  }

  public removeFromCart(): void {
    if (!this.authService.user$.value) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.item.inCart = false;
    this.cartService.removeFromCart(this.item.productId).pipe(catchError(this.handleCartError.bind(this))).subscribe(response => {
      this.item.inCart = !response.data;

      if (response.data) {
        this.toast.successToast(`<b>${this.item.name.length >= 35 ? this.item.name.substring(0, 32) + "..." : this.item.name}</b> was removed from Shopping Cart`);
        let cartCount = this.cartService.cartCount$.value ?? 0;
        this.cartService.cartCount$.next(cartCount > 0 ? cartCount - 1 : 0);
      }
    });
  }
}
