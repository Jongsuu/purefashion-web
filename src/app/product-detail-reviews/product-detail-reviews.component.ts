import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PaginationComponent } from '../pagination/pagination.component';
import { slightFadeIn } from '../animations';
import { dtoReviewItem } from '../../interfaces/product.interface';
// @ts-ignore
import Identicon from "identicon.js";

@Component({
  selector: 'app-product-detail-reviews',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    PaginationComponent
  ],
  templateUrl: './product-detail-reviews.component.html',
  styleUrl: './product-detail-reviews.component.css',
  animations: [slightFadeIn]
})
export class ProductDetailReviewsComponent {

  @Input() reviews: dtoReviewItem[] = [];

  getAuthorIcon(id: string): string {
    // @ts-ignore
    return new Identicon(id, 420).toString();
  }
}
