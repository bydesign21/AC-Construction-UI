import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsInputTemplateComponent } from './no-results-input-template.component';

describe('NoResultsInputTemplateComponent', () => {
  let component: NoResultsInputTemplateComponent;
  let fixture: ComponentFixture<NoResultsInputTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultsInputTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoResultsInputTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
