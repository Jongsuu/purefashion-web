import { Injectable } from '@angular/core';
import { OrderProduct, dtoOrderListItem } from '../../interfaces/order.interface';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { dtoPaginationFilter } from '../../interfaces/filters.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private env = "http://localhost:5277";

  constructor(private http: HttpClient, private auth: AuthService) { }

  public getOrders(filter: dtoPaginationFilter) {
    return this.http.get<dtoListResponse<dtoOrderListItem>>(this.env + "/orders",
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
        params: {
          filter: JSON.stringify(filter)
        }
      });
  }

  public createOrder(products: OrderProduct[]) {
    return this.http.post<dtoActionResponse<boolean>>(this.env + "/order", products,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
      });
  }

  public createOrderFromCart() {
    return this.http.post<dtoActionResponse<boolean>>(this.env + "/order/cart", null,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
      });
  }
}
