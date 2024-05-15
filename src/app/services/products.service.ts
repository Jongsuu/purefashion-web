import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { dtoActionResponse, dtoListResponse } from '../../interfaces/response.interface';
import { dtoProduct, dtoProductEntity, dtoProductListItem } from '../../interfaces/product.interface';
import { dtoProductListFilter } from '../../interfaces/productFilter.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private env = "http://localhost:5277";

  constructor(private http: HttpClient, private auth: AuthService) { }

  public getProducts(filter: dtoProductListFilter, category: string | null) {
    return this.http.get<dtoListResponse<dtoProductListItem>>(this.env + `/products${(category ? "/" + category : "")}`,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        },
        params: {
          filter: JSON.stringify(filter)
        }
      });
  }

  public getProductById(productId: string) {
    return this.http.get<dtoActionResponse<dtoProductEntity>>(this.env + `/product/${productId}`,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }

  public createProduct(newProduct: dtoProduct) {
    return this.http.post<dtoActionResponse<boolean>>(this.env + "/product", newProduct,
      {
        headers: {
          Authorization: "Bearer " + this.auth.user$.value?.token
        }
      });
  }
}
