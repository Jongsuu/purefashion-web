import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeService } from '../services/theme.service';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { slightFadeIn } from '../animations';
import { dtoOrderListItem, dtoOrderStatus } from '../../interfaces/order.interface';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';
import { OrdersService } from '../services/orders.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoListResponse } from '../../interfaces/response.interface';
import { ToastService } from '../services/toast.service';

const PAGESIZE = 5;

const ORDER_STATUS_COLOR: { [key: string]: string } = {
  "NOT_SHIPPED": "bg-amber-500/20 dark:bg-amber-500/40 text-amber-500 dark:text-amber-200",
  "SHIPPING": "bg-blue-500/20 dark:bg-blue-500/40 text-blue-500 dark:text-blue-200",
  "SHIPPED": "bg-purple-500/20 dark:bg-purple-500/40 text-purple-500 dark:text-purple-200",
  "IN_DELIVERY": "bg-sky-500/20 dark:bg-sky-500/40 text-sky-500 dark:text-sky-200",
  "DELIVERED": "bg-green-500/20 dark:bg-green-500/40 text-green-500 dark:text-green-200",
  "DELAYED": "bg-red-500/20 dark:bg-red-500/40 text-red-500 dark:text-red-200",
  "LOST": "bg-red-500/20 dark:bg-red-500/40 text-red-500 dark:text-red-200"
};

const ORDER_STATUS: { [key: string]: string } = {
  "NOT_SHIPPED": "Not shipped",
  "SHIPPING": "Shipping",
  "SHIPPED": "Shipped",
  "IN_DELIVERY": "Delivering",
  "DELIVERED": "Delivered",
  "DELAYED": "Delayed",
  "LOST": "Lost"
};

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    PaginationComponent,
    AsyncPipe
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  animations: [slightFadeIn]
})
export class OrdersComponent implements OnInit {
  @ViewChild("ordersSection") ordersSectionRef!: ElementRef<HTMLElement>;

  orders: dtoOrderListItem[] = [];
  resultsCount = 0;
  isLoading = true;

  nOrders = [...Array(PAGESIZE).keys()];

  currentPage = 0;
  totalPages = 0;
  pageSize = PAGESIZE;

  constructor(public themeService: ThemeService, private router: Router, private toast: ToastService, private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    const filter: dtoPaginationFilter = {
      pageIndex: this.currentPage,
      pageSize: PAGESIZE
    };

    this.ordersService.getOrders(filter)
      .pipe(catchError(this.handleGetCartProductsError.bind(this)))
      .subscribe(response => {
        setTimeout(() => {
          // response.data[0].status = dtoOrderStatus[dtoOrderStatus.LOST] as any;
          this.orders = response.data;
          this.resultsCount = response.resultsCount;
          this.totalPages = Math.ceil(response.resultsCount / PAGESIZE);
          this.isLoading = false;
        }, 100);
      });
  }

  private handleGetCartProductsError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoListResponse<dtoOrderListItem>;

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
    this.ordersSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getOrders();
  }

  public onPrevious(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.ordersSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getOrders();
  }

  public onNext(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.ordersSectionRef.nativeElement.scrollIntoView({
      block: "start"
    });
    this.getOrders();
  }

  public getOrderStatus(status: dtoOrderStatus): string {
    return ORDER_STATUS[status];
  }

  public getOrderStatusColors(status: dtoOrderStatus): string {
    return ORDER_STATUS_COLOR[status];
  }
}
