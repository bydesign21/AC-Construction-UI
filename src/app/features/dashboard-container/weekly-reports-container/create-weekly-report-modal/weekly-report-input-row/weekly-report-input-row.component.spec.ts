import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportInputRowComponent } from './weekly-report-input-row.component';

describe('WeeklyReportInputRowComponent', () => {
  let component: WeeklyReportInputRowComponent;
  let fixture: ComponentFixture<WeeklyReportInputRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyReportInputRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyReportInputRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
