import {computed, inject, Injectable, signal} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  combineLatest
} from "rxjs";
import {Product} from "./product";
import {HttpClient} from "@angular/common/http";
import {HttpErrorService} from "../utilities/http-error.service";
import {ReviewService} from "../reviews/review.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {ResultData} from "../utilities/result-data";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  readonly #http = inject(HttpClient)
  readonly #httpErrorService = inject(HttpErrorService)
  readonly #reviewService = inject(ReviewService)

  selectedProductId = signal<number|undefined>(undefined)

  private readonly products$ = this.#http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      shareReplay(1),
      map(p => ({ data: p} as ResultData<Product[]>)),
      catchError(err => of({data: [] as Product[] , error : this.#httpErrorService.formatError(err)}))
    );

  private productsResult = toSignal(this.products$, {initialValue : {data: [] } as ResultData<Product[]>})
  products = computed(() => this.productsResult().data)
  productsError = computed(() => this.productsResult().error)

  private product$ = combineLatest([ toObservable(this.selectedProductId), this.products$]).pipe(
    tap(x => x),
    map(([selectedProductId, products]) => {
      return  products.data?.find(product => product.id === selectedProductId)
    }),
    filter(Boolean),
    switchMap(product => this.getProductWithReviews(product)),
    catchError(err =>  of({data: undefined , error : this.#httpErrorService.formatError(err)})),
  );
  private productResult = toSignal(this.product$)
  product = computed(() => this.productResult()?.data)
  productError = computed(() => this.productResult()?.error)

  getProductWithReviews(product: Product): Observable<ResultData<Product>> {
    if (product.hasReviews) {
      return this.#reviewService.getReviews(product.id).pipe(
        map(reviews => ({data: {...product, reviews}}))
      );
    } else {
      return of({data:product});
    }
  }


  selectProduct(productId: number) {
    this.selectedProductId.set(productId)
  }
}
