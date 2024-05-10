import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { dtoActionResponse } from '../../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private env = "http://localhost:5277";

  constructor(private http: HttpClient, private auth: AuthService) { }

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
