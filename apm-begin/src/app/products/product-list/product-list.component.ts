import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import {NgIf, NgFor, NgClass, AsyncPipe} from '@angular/common';
import {Product} from '../product';
import {ProductDetailComponent} from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";
import {catchError, Subscription, tap} from "rxjs";

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent  {
  pageTitle = 'Products';
  errorMessage = '';

  readonly #productService = inject(ProductService)
  readonly products$ = this.#productService.product$
    .pipe(
      catchError((err) => {
        this.errorMessage = err;
        return [];
      }));


  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    console.log("selected product id: ", productId);
    this.selectedProductId = productId;
  }

}
