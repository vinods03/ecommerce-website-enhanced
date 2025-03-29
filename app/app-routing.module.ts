import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsByProductCategoryComponent } from './components/products-by-product-category/products-by-product-category.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

const routes: Routes = [
  {
    path: 'category/:id',
    component: ProductsByProductCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: ProductsByProductCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cart-details',
    component: CartDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: AuthenticationComponent },
  { path: 'cart-status', component: CartStatusComponent },
  { path: 'cart-details', component: CartDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
