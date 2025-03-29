import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthenticationService
  ) {}
  product_id_queried: number = 1;
  product!: Product;
  user: User | null | undefined = new User('', '', '', new Date('1900-01-01'));

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.retrieveProduct());
    this.authService.user.subscribe((data) => (this.user = data));
  }

  retrieveProduct() {
    this.product_id_queried = +this.route.snapshot.paramMap.get('id')!;
    this.productsService
      .getProductById(this.product_id_queried)
      .subscribe((data) => {
        this.product = data;
      });
  }

  // addToCart(item: Item) {
  //   this.cartService.addToCart(item);
  // }

  addProdToCart(product: Product) {
    if (this.user) {
      let loggedInUser: User = this.user;
      this.cartService.addProdToCart(loggedInUser, product);
    }
  }

  goBack() {
    this.router.navigate(['/category/1']);
  }

  logout() {
    this.authService.signOut();
  }
}
