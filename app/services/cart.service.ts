import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/country';
import { State } from '../models/state';
import { Purchase } from '../models/purchase';
import { Item } from '../models/item';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {}

  cartItems: Item[] = [];
  // userCartItems: Item[] = [];
  // userCartItems: Subject<Item[]> = new BehaviorSubject<Item[]>([]);

  totalQuantityValue: number = 0;
  totalPriceValue: number = 0.0;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  user: User | null | undefined = null;

  private countriesUrl =
    'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/countries';
  private statesByCountryUrl =
    'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/states/';
  private createOrderUrl =
    'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/purchase';

  months: number[] = [];
  years: number[] = [];

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesUrl);
  }

  getStatesByCountry(country_id: number): Observable<State[]> {
    return this.httpClient.get<State[]>(this.statesByCountryUrl + country_id);
  }

  getMonths(): Observable<number[]> {
    for (let i = 1; i <= 12; i++) {
      this.months.push(i);
    }

    return of(this.months);
  }

  getYears(): Observable<number[]> {
    let startYear: number = new Date().getFullYear();
    for (let j = startYear; j <= startYear + 10; j++) {
      this.years.push(j);
    }

    return of(this.years);
  }

  getCartItems(): Observable<Item[]> {
    return of(this.cartItems);
  }

  addToCart(item: Item) {
    // The indexOf approach did not work for me

    // console.log('The cart items are: ', this.cartItems);
    // console.log('The item to be added is: ', item);
    // console.log('idx of item is in array is: ', this.cartItems.indexOf(item));

    // if (this.cartItems.indexOf(item) === -1) {
    //   this.cartItems.push(item);
    //   this.calculateTotals(item, 'add');
    // } else {
    //   let idx = this.cartItems.indexOf(item);
    //   this.cartItems[idx].quantity = this.cartItems[idx].quantity + 1;
    //   this.calculateTotals(item, 'add');
    // }

    // Instead of IndexOf i used the below looping method
    let qtyUpdated: boolean = false;

    // first item in the cart
    if (this.cartItems.length == 0) {
      this.cartItems.push(item);

      this.calculateTotals();
    }
    // there are other items in cart. check if the new item being added is already there in the cart
    // if present, only update the quantity value of the cart item
    else {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (item.id === this.cartItems[i].id) {
          this.cartItems[i].quantity = this.cartItems[i].quantity + 1;
          this.calculateTotals();
          qtyUpdated = true;
        } else {
          continue;
        }
      }

      // if the new item is not in the cart, push the item to cart
      if (!qtyUpdated) {
        this.cartItems.push(item);
        this.calculateTotals();
      }
    }
    localStorage.setItem('cartData', JSON.stringify(this.cartItems));
  }

  addProdToCart(userDetails: User, product: Product) {
    let user = userDetails;
    let category_id = product.category_id;
    let description = product.description;
    let id = product.id;
    let image_url = product.image_url;
    let name = product.name;
    let quantity = 1;
    let unit_price = product.unit_price;
    let itemToBeAdded: Item = {
      user,
      category_id,
      description,
      id,
      image_url,
      name,
      quantity,
      unit_price,
    };
    this.addToCart(itemToBeAdded);
  }

  removeFromCart(item: Item) {
    this.cartItems.splice(this.cartItems.indexOf(item), 1);
    localStorage.setItem('cartData', JSON.stringify(this.cartItems));
    this.calculateTotals();
  }

  clearCart(user: User) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (user.email === this.cartItems[i].user?.email) {
        this.cartItems.splice(i--, 1);
      }
    }

    localStorage.setItem('cartData', JSON.stringify(this.cartItems));
    this.totalPriceValue = 0;
    this.totalQuantityValue = 0;
    this.totalQuantity.next(this.totalQuantityValue);
    this.totalPrice.next(this.totalPriceValue);
  }

  calculateTotals() {
    // to handle 1 item having more than 1 quantity, below line of code was commneted out
    // this.totalQuantityValue = this.cartItems.length;

    // total quantity calculation

    this.authService.user.subscribe((data) => (this.user = data));
    this.totalQuantityValue = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.user?.email == this.cartItems[i].user?.email) {
        this.totalQuantityValue =
          this.totalQuantityValue + this.cartItems[i].quantity;
      }
    }

    // total price calculation

    this.totalPriceValue = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.user?.email == this.cartItems[i].user?.email) {
        this.totalPriceValue =
          this.totalPriceValue +
          this.cartItems[i].quantity * this.cartItems[i].unit_price;
      }
    }

    this.totalQuantity.next(this.totalQuantityValue);
    this.totalPrice.next(this.totalPriceValue);
  }

  autoLoadCart(user: User | null | undefined) {
    this.cartItems = JSON.parse(localStorage.getItem('cartData') || '{}');

    this.totalQuantityValue = 0;
    this.totalPriceValue = 0;

    for (let i = 0; i < this.cartItems.length; i++) {
      if (user?.email == this.cartItems[i].user?.email) {
        this.totalQuantityValue =
          this.totalQuantityValue + this.cartItems[i].quantity;

        this.totalPriceValue =
          this.totalPriceValue +
          this.cartItems[i].quantity * this.cartItems[i].unit_price;
      }
    }

    this.totalQuantity.next(this.totalQuantityValue);
    this.totalPrice.next(this.totalPriceValue);
  }

  createOrder(purchase: Purchase) {
    return this.httpClient.post(this.createOrderUrl, purchase);
  }
}
