import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportsContainerComponent } from './weekly-reports-container.component';

describe('WeeklyReportsContainerComponent', () => {
  let component: WeeklyReportsContainerComponent;
  let fixture: ComponentFixture<WeeklyReportsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyReportsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyReportsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
