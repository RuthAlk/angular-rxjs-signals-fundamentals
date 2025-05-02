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
  readonly selectedProductId = this.#productService.selectedProductId

  readonly products = this.#productService.products

  onSelected(productId: number): void {
    console.log("selected product id: ", productId);
    this.#productService.selectProduct(productId);
  }

}
