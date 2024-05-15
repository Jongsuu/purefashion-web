import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { dtoProductEntity, dtoProductListItem } from '../../interfaces/product.interface';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { dtoActionResponse } from '../../interfaces/response.interface';
import { ToastService } from '../services/toast.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { slightFadeIn } from '../animations';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductCategory, dtoProductListFilter } from '../../interfaces/productFilter.interface';

const PAGESIZE = 12;

const PRODUCT_CATEGORY_COLORS = {
  men: "bg-purple-500/20 text-purple-500",
  women: "bg-rose-500/20 text-rose-500",
  jewelry: "bg-blue-500/20 text-blue-500",
  electronics: "bg-green-500/20 text-green-500",
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    PaginationComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  animations: [slightFadeIn]
})
export class ProductsComponent implements OnInit {

  category: ProductCategory | undefined;
  productCategoryColors: { [key: string]: string } = PRODUCT_CATEGORY_COLORS;

  products: dtoProductListItem[] = [];
  resultsCount = 0;
  isLoading = true;

  nProducts = [...Array(PAGESIZE).keys()];

  currentPage = 0;
  totalPages = 0;
  pageSize = PAGESIZE;

  constructor(private toast: ToastService, private productService: ProductsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let path = this.activatedRoute.routeConfig?.path;
    this.category = ProductCategory[path as keyof typeof ProductCategory];
    this.getProducts();
  }

  public getLowRangePageItems(): number {
    return this.currentPage * this.pageSize + 1;
  }

  public getTopRangePageItems(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.resultsCount);
  }

  public onGoToPage(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getProducts();
  }

  public onPrevious(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getProducts();
  }

  public onNext(page: number): void {
    this.currentPage = page;
    this.isLoading = true;
    this.getProducts();
  }

  private getProducts(): void {
    const filter: dtoProductListFilter = {
      pageIndex: this.currentPage,
      pageSize: PAGESIZE
    };

    this.productService.getProducts(filter, this.category ? ProductCategory[this.category] : null)
      .pipe(catchError(this.handleGetProductsError.bind(this)))
      .subscribe(response => {
        setTimeout(() => {
          this.products = response.data;
          this.resultsCount = response.resultsCount;
          this.totalPages = Math.ceil(response.resultsCount / PAGESIZE);
          this.isLoading = false;
        }, 100);
      });
  }

  private handleGetProductsError(error: HttpErrorResponse) {
    try {
      const response = error.error as dtoActionResponse<dtoProductEntity[]>;

      if (response && response.message)
        this.toast.errorToast(response.message);
      else
        this.toast.errorToast("Unexpected error when fetching products");

      return throwError(() => new Error(response.message));
    }
    catch (ex) {
      return throwError(() => ex);
    }
  }
}
