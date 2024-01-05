import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportModalComponent } from '../../../dashboard/weekly-reports-container/create-weekly-report-analysis-modal/create-report-modal.component';

describe('CreateReportModalComponent', () => {
  let component: CreateReportModalComponent;
  let fixture: ComponentFixture<CreateReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
