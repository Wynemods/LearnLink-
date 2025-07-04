import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutForm } from './checkout-form';

describe('CheckoutForm', () => {
  let component: CheckoutForm;
  let fixture: ComponentFixture<CheckoutForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
