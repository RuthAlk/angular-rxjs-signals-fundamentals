import {Component, computed, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import {NgIf, NgFor, CurrencyPipe, AsyncPipe} from '@angular/common';
import { Product } from '../product';
import {ProductService} from "../product.service";
import {catchError, filter, map, Subscription, tap} from "rxjs";
import {CartService} from "../../cart/cart.service";

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent  {
  readonly #cartService = inject(CartService);
  readonly #productService = inject(ProductService);
  readonly product = this.#productService.product
  readonly errorMessage = this.#productService.productError

  readonly pageTitle = computed(() => {
    const product = this.product()
    return product ? `Product Detail for: ${product.productName}` : 'Product Detail'
  });

  addToCart(product: Product) {
    this.#cartService.addToCart(product);
  }
}
