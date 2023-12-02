import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilsService {
  constructor() {}

  formatDateRange(dateRange: Date[]): string {
    if (dateRange.length !== 2) {
      return 'Invalid date range';
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${String(month).padStart(2, '0')}/${String(day).padStart(
        2,
        '0'
      )}/${year}`;
    };

    return dateRange.map(formatDate).join(' - ');
  }
}
