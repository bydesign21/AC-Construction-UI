import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeeklyReportModalComponent } from './create-weekly-report-modal.component';

describe('CreateWeeklyReportModalComponent', () => {
  let component: CreateWeeklyReportModalComponent;
  let fixture: ComponentFixture<CreateWeeklyReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeeklyReportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWeeklyReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
