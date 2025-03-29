import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsByProductCategoryComponent } from './products-by-product-category.component';

describe('ProductsByProductCategoryComponent', () => {
  let component: ProductsByProductCategoryComponent;
  let fixture: ComponentFixture<ProductsByProductCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsByProductCategoryComponent]
    });
    fixture = TestBed.createComponent(ProductsByProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
