import { TestBed } from '@angular/core/testing';

import { SecondaryNavigationBarService } from './secondary-navigation-bar.service';

describe('SecondaryNavigationBarService', () => {
  let service: SecondaryNavigationBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondaryNavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
