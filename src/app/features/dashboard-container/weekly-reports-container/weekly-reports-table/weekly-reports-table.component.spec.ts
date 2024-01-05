import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportsTableComponent } from './weekly-reports-table.component';

describe('WeeklyReportsTableComponent', () => {
  let component: WeeklyReportsTableComponent;
  let fixture: ComponentFixture<WeeklyReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyReportsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
