import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesContainerComponent } from './invoices-container.component';

describe('InvoicesContainerComponent', () => {
  let component: InvoicesContainerComponent;
  let fixture: ComponentFixture<InvoicesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
