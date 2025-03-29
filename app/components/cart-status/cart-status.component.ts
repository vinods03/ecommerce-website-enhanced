import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthenticationService
  ) {}

  total_quantity: number = 0;
  total_price: number = 0;
  user: User | null | undefined = null;

  ngOnInit(): void {
    this.authService.user.subscribe((data) => {
      this.user = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.total_quantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.total_price = data;
    });
  }
}
