import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal.component';

describe('DeleteWeeklyReportModalComponent', () => {
  let component: DeleteWeeklyReportModalComponent;
  let fixture: ComponentFixture<DeleteWeeklyReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWeeklyReportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteWeeklyReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
