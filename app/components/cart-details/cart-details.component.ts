import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/models/item';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  cartItems: Item[] = [];
  userCartItems: Item[] = [];

  total_quantity: number = 0;
  total_price: number = 0;
  user: User | null | undefined = new User('', '', '', new Date('1900-01-01'));

  ngOnInit(): void {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalQuantity.subscribe((data) => {
      this.total_quantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.total_price = data;
    });

    this.authService.user.subscribe((data) => {
      this.user = data;
    });

    this.userCartItems = [];
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.user?.email == this.cartItems[i].user?.email) {
        this.userCartItems.push(this.cartItems[i]);
      }
    }

    // this.cartService.userCartItems.subscribe((data) => {
    //   this.userCartItems = data;
    // });
  }

  removeItem(item: Item) {
    this.cartService.removeFromCart(item);
    this.userCartItems = [];
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.user?.email == this.cartItems[i].user?.email) {
        this.userCartItems.push(this.cartItems[i]);
      }
    }
  }

  clearCart() {
    this.userCartItems = [];
    if (this.user) {
      let loggedInUser: User = this.user;
      this.cartService.clearCart(loggedInUser);
    }

    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.user?.email == this.cartItems[i].user?.email) {
        this.userCartItems.push(this.cartItems[i]);
      }
    }
  }

  logout() {
    this.authService.signOut();
  }

  goBack() {
    this.router.navigate(['/category/1']);
  }
}
