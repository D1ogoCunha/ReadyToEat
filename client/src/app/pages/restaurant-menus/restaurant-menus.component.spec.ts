import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantMenusComponent } from './restaurant-menus.component';

describe('RestaurantMenusComponent', () => {
  let component: RestaurantMenusComponent;
  let fixture: ComponentFixture<RestaurantMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantMenusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
