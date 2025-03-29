import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from './models/user';
import { CartService } from './services/cart.service';
import { Item } from './models/item';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-retail-website-app';
  constructor(
    private authService: AuthenticationService,
    private cartService: CartService
  ) {}
  user: User | null | undefined = null;
  cartItems: Item[] = [];

  // totalQuantity: number = 0;
  // totalPrice: number = 0.0;

  // totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  // totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    this.authService.autoLogin();

    this.authService.user.subscribe((data) => {
      this.user = data;
    });

    this.cartService.autoLoadCart(this.user);

    // this.cartService.totalQuantity.subscribe(
    //   (data) => (this.totalQuantity = data)
    // );
    // this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
  }

  logout() {
    this.authService.signOut();
  }
}
