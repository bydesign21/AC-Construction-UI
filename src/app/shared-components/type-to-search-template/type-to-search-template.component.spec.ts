import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeToSearchTemplateComponent } from './type-to-search-template.component';

describe('TypeToSearchTemplateComponent', () => {
  let component: TypeToSearchTemplateComponent;
  let fixture: ComponentFixture<TypeToSearchTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeToSearchTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeToSearchTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
