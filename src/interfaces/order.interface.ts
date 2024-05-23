import { dtoProductData } from "./product.interface";

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface dtoOrderListItem {
  orderId: string;
  total: number;
  status: dtoOrderStatus;
  orderDate: Date;
  deliveryDate: Date;
  order: dtoOrderProducts;
}

export interface dtoOrderProducts {
  products: dtoOrderListItemProduct[];
  productsCount: number;
}

export interface dtoOrderListItemProduct extends dtoProductData {
  quantity: number;
}

export enum dtoOrderStatus {
  "NOT_SHIPPED",
  "SHIPPING",
  "SHIPPED",
  "IN_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "LOST"
}
