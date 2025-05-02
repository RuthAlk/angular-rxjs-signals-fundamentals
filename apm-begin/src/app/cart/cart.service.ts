import {computed, Injectable, signal} from "@angular/core";
import {CartItem} from "./cart";
import {Product} from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() =>
    this.cartItems().reduce(
      (qty, item) => qty + item.quantity, 0
    )
  );

  subTotal = computed(() => this.cartItems().reduce(
    (total, item) => total + item.quantity * item.product.price, 0
  ));

  deliveryFee = computed(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed(() => this.subTotal() * .1076)
  totalPrice = computed(() => this.subTotal() + this.tax() + this.deliveryFee())

  addToCart(product: Product) {
    this.cartItems.update(items => {
      return [...items, {product, quantity: 1}];
    });
  }

  updateQuantity(cartItem: CartItem, quantity: number) {
    this.cartItems.update(items =>
      items.map(item => item.product.id === cartItem.product.id ? {...item, quantity} : item)
    )
  }

  removeFromCart(cartItem: CartItem) {
    this.cartItems.update(items => items.filter(item => item.product.id != cartItem.product.id))
  }
}
