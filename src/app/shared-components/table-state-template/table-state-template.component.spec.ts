import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStateTemplateComponent } from './table-state-template.component';

describe('TableStateTemplateComponent', () => {
  let component: TableStateTemplateComponent;
  let fixture: ComponentFixture<TableStateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableStateTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableStateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
