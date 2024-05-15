export interface dtoProductData {
  productId: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface dtoProductListItem extends dtoProductData {
  reviewAverage: number;
  reviewCount: number;
}

export interface dtoProductEntity extends dtoProductListItem {
  description: string;
  author: dtoAuthor;
  reviews: dtoReviewItem[];
  inCart: boolean;
}

export interface dtoProductCartData extends dtoProductData {
  addedDate: Date;
}

export interface dtoProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
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
