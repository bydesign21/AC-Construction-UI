import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksContainerComponent } from './checks-container.component';

describe('ChecksContainerComponent', () => {
  let component: ChecksContainerComponent;
  let fixture: ComponentFixture<ChecksContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecksContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecksContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
