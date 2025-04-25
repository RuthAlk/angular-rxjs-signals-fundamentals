import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Review} from "./review";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  readonly #http = inject(HttpClient)
  private reviewsUrl = 'api/reviews';

  getReviewUrl(productId: number): string {
    // Use appropriate regular expression syntax to
    // get an exact match on the id
    return this.reviewsUrl + '?productId=^' + productId + '$';
  }

  getReviews(productId: number) {
    const reviewUrl = this.getReviewUrl(productId);
    return this.#http.get<Review[]>(reviewUrl);
  }
}
