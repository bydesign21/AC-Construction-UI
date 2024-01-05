import { TestBed } from '@angular/core/testing';

import { WeeklyReportsService } from '../../../dashboard/checks-container/checks-services/weekly-reports.service';

describe('WeeklyReportsService', () => {
  let service: WeeklyReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
