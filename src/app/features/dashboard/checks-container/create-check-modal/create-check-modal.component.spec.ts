import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCheckModalComponent } from './create-invoice-modal.component';

describe('CreateCheckModalComponent', () => {
  let component: CreateCheckModalComponent;
  let fixture: ComponentFixture<CreateCheckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCheckModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
