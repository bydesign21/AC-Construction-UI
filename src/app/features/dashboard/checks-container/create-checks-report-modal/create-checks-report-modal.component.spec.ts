import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChecksReportModalComponent } from './create-report-modal.component';

describe('CreateChecksReportModalComponent', () => {
  let component: CreateChecksReportModalComponent;
  let fixture: ComponentFixture<CreateChecksReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChecksReportModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChecksReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
