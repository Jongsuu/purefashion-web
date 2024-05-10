export interface dtoProductEntity extends dtoProductListItem {
  description: string;
  author: dtoAuthor;
  reviews: dtoReviewItem[];
  inCart: boolean;
}

export interface dtoProductListItem {
  productId: number;
  name: string;
  price: number;
  categoryId: number;
  image: string;
  reviewAverage: number;
  reviewCount: number;
}

export interface dtoProduct {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
}

export interface dtoProductListFilter {
  minPrice?: number;
  maxPrice?: number;
  pageIndex: number;
  pageSize: number;
  sortOrder?: string;
  sortField?: string;
}

export enum ProductCategory {
  men = "men",
  women = "women",
  jewelry = "jewelry",
  electronics = "electronics"
}

export interface dtoAuthor {
  id: string;
  username: string;
}

export interface dtoReviewItem {
  title: string;
  description: string;
  rating: number;
  author: dtoAuthor;
}
