import {inject, Injectable} from '@angular/core';
import {catchError, concatMap, map, mergeMap, Observable, of, switchMap, tap} from "rxjs";
import {Product} from "./product";
import {HttpClient} from "@angular/common/http";
import {HttpErrorService} from "../utilities/http-error.service";
import {ReviewService} from "../reviews/review.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly #http = inject(HttpClient)
  readonly #httpErrorService = inject(HttpErrorService)
  readonly #reviewService = inject(ReviewService)

  private productsUrl = 'api/products';

  getProducts(): Observable<Product[]> {
    return this.#http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(data => console.log(data)),
        catchError(err => this.handleError(err))
      );
  }

  getProductById(id: number): Observable<Product | undefined> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.#http.get<Product>(productUrl)
      .pipe(
        tap(data => console.log(data)),
        switchMap(data => this.getProductWithReviews(data)),
        tap(data => console.log('Product with reviews', data)),
        catchError(err => this.handleError(err)),
      );
  }

  getProductWithReviews(product:Product): Observable<Product> {
    if (product.hasReviews) {
      return this.#reviewService.getReviews(product.id).pipe(
        map(reviews => ({...product, reviews}))
      );
    } else {
      return of(product);
    }
  }

  private handleError(err: any): Observable<never> {
    throw this.#httpErrorService.formatError(err);
  }

}
