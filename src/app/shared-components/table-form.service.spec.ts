import { TestBed } from '@angular/core/testing';

import { TableFormService } from './table-form.service';

describe('TableFormService', () => {
  let service: TableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
