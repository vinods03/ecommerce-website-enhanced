import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/models/product-category';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css'],
})
export class ProductCategoriesComponent implements OnInit {
  constructor(private productsService: ProductsService) {}
  product_categories: ProductCategory[] = [];

  ngOnInit(): void {
    this.productsService.getProductCategories().subscribe((data) => {
      this.product_categories = data;
    });
  }
}
