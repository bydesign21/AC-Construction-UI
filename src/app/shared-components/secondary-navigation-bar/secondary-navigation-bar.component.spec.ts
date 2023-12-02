import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNavigationBarComponent } from './secondary-navigation-bar.component';

describe('SecondaryNavigationBarComponent', () => {
  let component: SecondaryNavigationBarComponent;
  let fixture: ComponentFixture<SecondaryNavigationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryNavigationBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
