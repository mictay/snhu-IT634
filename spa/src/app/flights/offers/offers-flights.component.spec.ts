import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OffersFlightsComponent } from './offers-flights.component';
describe('OffersFlightsComponent', () => {
  let component: OffersFlightsComponent;
  let fixture: ComponentFixture<OffersFlightsComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OffersFlightsComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OffersFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
