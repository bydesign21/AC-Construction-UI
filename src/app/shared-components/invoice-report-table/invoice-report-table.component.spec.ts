import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReportTableComponent } from './invoice-report-table.component';

describe('InvoiceReportTableComponent', () => {
  let component: InvoiceReportTableComponent;
  let fixture: ComponentFixture<InvoiceReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceReportTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
