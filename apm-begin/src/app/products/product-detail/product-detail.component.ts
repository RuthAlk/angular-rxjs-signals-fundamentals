import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import {ProductService} from "../product.service";
import {filter, Subscription, tap} from "rxjs";

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements  OnDestroy,OnChanges {
  readonly #productService = inject(ProductService)
  sub?:Subscription

  @Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  addToCart(product: Product) {
  }

  ngOnChanges(changes:SimpleChanges): void {
    console.log('ngOnChanges', changes);
    let id = changes['productId'].currentValue;
    if (id) {
      this.productId = id;
      this.loadProduct();
    }
    this.pageTitle = `Product Detail for: ${this.product?.productName}`;
  }

  loadProduct() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.#productService.getProductById(this.productId)
      .pipe(
        tap(data => console.log('Got product ',data)),
        filter(product => !!product))
      .subscribe({
      next: product => {
        this.product = product!;
        this.pageTitle = `Product Detail for: ${this.product.productName}`;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
