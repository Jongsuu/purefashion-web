import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { dtoProductCartData } from '../../interfaces/product.interface';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private env = "http://localhost:5277";

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

  public addToCart(productId: number) {
    return this.http.post<dtoActionResponse<boolean>>(this.env + `/product/${productId}/cart`, null,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }

  public removeFromCart(productId: number) {
    return this.http.delete<dtoActionResponse<boolean>>(this.env + `/product/${productId}/cart`,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }
}
