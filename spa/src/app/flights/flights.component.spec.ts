import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FlightsComponent } from './flights.component';
describe('AuditorDashboardComponent', () => {
  let component: FlightsComponent;
  let fixture: ComponentFixture<FlightsComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FlightsComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
