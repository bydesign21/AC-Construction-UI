import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksReportTableComponent } from './checks-report-table.component';

describe('ChecksReportTableComponent', () => {
  let component: ChecksReportTableComponent;
  let fixture: ComponentFixture<ChecksReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecksReportTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecksReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
