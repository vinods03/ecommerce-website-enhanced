import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/country';
import { Item } from 'src/app/models/item';
import { Product } from 'src/app/models/product';
import { Purchase } from 'src/app/models/purchase';
import { State } from 'src/app/models/state';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  countries: Country[] = [];
  states: State[] = [];

  months: number[] = [];
  years: number[] = [];

  total_price: number = 0;
  total_quantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthenticationService,
    private router: Router
  ) {}
  cart_items: Item[] = [];

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
      }),

      address: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', Validators.required),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
      }),

      creditCard: this.formBuilder.group({
        creditCardType: new FormControl('', [Validators.required]),
        creditCardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        creditCardCVV: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        creditCardName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        expiryYear: new FormControl('', [Validators.required]),
        expiryMonth: new FormControl('', [Validators.required]),
      }),
    });

    this.cartService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.cartService.getMonths().subscribe((data) => {
      this.months = data;
    });

    this.cartService.getYears().subscribe((data) => {
      this.years = data;
    });
  }

  getStatesByCountry() {
    let country_id = this.checkoutFormGroup.get('address')?.value.country.id;
    // console.log('Country ID is: ', country_id)

    this.cartService.getStatesByCountry(country_id).subscribe((data) => {
      this.states = data;
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get street() {
    return this.checkoutFormGroup.get('address.street');
  }

  get city() {
    return this.checkoutFormGroup.get('address.city');
  }

  get state() {
    return this.checkoutFormGroup.get('address.state');
  }

  get country() {
    return this.checkoutFormGroup.get('address.country');
  }

  get zipCode() {
    return this.checkoutFormGroup.get('address.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.creditCardType');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.creditCardNumber');
  }

  get creditCardCVV() {
    return this.checkoutFormGroup.get('creditCard.creditCardCVV');
  }

  get creditCardName() {
    return this.checkoutFormGroup.get('creditCard.creditCardName');
  }

  get expiryYear() {
    return this.checkoutFormGroup.get('creditCard.expiryYear');
  }

  get expiryMonth() {
    return this.checkoutFormGroup.get('creditCard.expiryMonth');
  }

  logout() {
    this.authService.signOut();
  }

  onSubmit() {
    // Get all the form values and create an object as required in the cart service createOrder() function

    // console.log(first_name)
    let first_name = this.checkoutFormGroup.get('customer.firstName')?.value;
    let last_name = this.checkoutFormGroup.get('customer.lastName')?.value;
    let email = this.checkoutFormGroup.get('customer.email')?.value;

    let street = this.checkoutFormGroup.get('address.street')?.value;
    let city = this.checkoutFormGroup.get('address.city')?.value;
    let state = this.checkoutFormGroup.get('address.state')?.value;
    let country = this.checkoutFormGroup.get('address.country')?.value;
    let zip_code = this.checkoutFormGroup.get('address.zipCode')?.value;

    this.cartService.getCartItems().subscribe((data) => {
      this.cart_items = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.total_price = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.total_quantity = data;
    });

    // console.log(this.total_price)
    // console.log(this.total_quantity)

    let purchase = new Purchase();

    purchase.first_name = first_name;
    purchase.last_name = last_name;
    purchase.email = email;
    purchase.street = street;
    purchase.city = city;
    purchase.state = state;
    purchase.country = country;
    purchase.zip_code = zip_code;
    purchase.cart_items = this.cart_items;
    purchase.total_price = this.total_price;
    purchase.total_quantity = this.total_quantity;

    this.cartService.createOrder(purchase).subscribe((data) => {
      alert(`Your order has been received.\nOrder tracking number: ${data}`);
    });
  }

  goBack() {
    this.router.navigate(['/category/1']);
  }
}
