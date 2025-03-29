import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/models/item';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-by-product-category',
  templateUrl: './products-by-product-category.component.html',
  styleUrls: ['./products-by-product-category.component.css'],
})
export class ProductsByProductCategoryComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthenticationService
  ) {}

  categoryId: number = 1;
  products: Product[] = [];
  items: Item[] = [];
  user: User | null | undefined = new User('', '', '', new Date('1900-01-01'));

  ngOnInit(): void {
    // this.productsService
    //   .getProductsByCategory(this.categoryId)
    //   .subscribe((data) => {
    //     this.products = data;
    //   });

    this.route.paramMap.subscribe(() => this.listProducts());
    this.authService.user.subscribe((data) => (this.user = data));
    this.cartService.autoLoadCart(this.user);
  }

  listProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // not category id available ... default to category id 1
      this.categoryId = 1;
    }

    // now get the products for the given category id
    this.productsService
      .getProductsByCategory(this.categoryId)
      .subscribe((data) => {
        this.products = data;
      });
  }

  // addToCart(product: Product) {
  //   this.cartService.addToCart(product);
  // }

  addProdToCart(product: Product) {
    if (this.user) {
      let loggedInUser: User = this.user;
      this.cartService.addProdToCart(loggedInUser, product);
    }
  }

  logout() {
    this.authService.signOut();
  }
}
