import { dtoPaginationFilter } from "./filters.interface";

export interface dtoProductListFilter extends dtoPaginationFilter {
  minPrice?: number;
  maxPrice?: number;
  sortOrder?: string;
  sortField?: string;
}

export enum ProductCategory {
  men = "men",
  women = "women",
  jewelry = "jewelry",
  electronics = "electronics"
}
