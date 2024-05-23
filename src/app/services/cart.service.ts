import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { dtoProductCartData } from '../../interfaces/product.interface';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private env = "http://localhost:5277";

  public cartCount$ = new BehaviorSubject<number | undefined>(undefined);

  constructor(private http: HttpClient, private auth: AuthService) { }

  public getProductsFromCart(filter: dtoPaginationFilter) {
    return this.http.get<dtoListResponse<dtoProductCartData>>(this.env + "/products/cart",
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
        params: {
          filter: JSON.stringify(filter)
        }
      });
  }

  public getCartItemsCount() {
    return this.http.get<dtoActionResponse<number>>(this.env + "/products/cart/indicator",
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }

  public addToCart(productId: string, quantity: number) {
    return this.http.post<dtoActionResponse<boolean>>(this.env + `/product/${productId}/cart`, null,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
        params: {
          quantity: quantity
        }
      });
  }

  public removeFromCart(productId: string) {
    return this.http.delete<dtoActionResponse<boolean>>(this.env + `/product/${productId}/cart`,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }
}
