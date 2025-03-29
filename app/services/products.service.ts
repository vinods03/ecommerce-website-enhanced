import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  productCategoriesUrl = 'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/product-categories'
  productsByCategoryUrl = 'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/'
  productByIdUrl = 'https://z5evk1aln4.execute-api.us-east-1.amazonaws.com/prod/product/'

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.productCategoriesUrl)

  }

  getProductsByCategory(product_category: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productsByCategoryUrl+product_category)
  }

  getProductById(product_id: number): Observable<Product> {
    return this.httpClient.get<Product>(this.productByIdUrl+product_id)
  }
}


