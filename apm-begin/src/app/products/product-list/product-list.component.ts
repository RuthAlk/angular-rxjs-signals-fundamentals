import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly #productService = inject(ProductService)
  sub!:Subscription

  pageTitle = 'Products';
  errorMessage = '';

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    console.log("selected product id: ", productId);
    this.selectedProductId = productId;
  }

  ngOnInit() {
    this.sub = this.#productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
