import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SecondaryNavigationLink {
  label: string;
  routerUrl: string | string[];
  iconUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecondaryNavigationBarService {
  navigationLinks: BehaviorSubject<SecondaryNavigationLink[]> =
    new BehaviorSubject<SecondaryNavigationLink[]>([]);
  isMobileNavigationOpen: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isNavigationVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  constructor() {}

  setNavigationLinks(links: SecondaryNavigationLink[]) {
    this.navigationLinks.next(links);
  }

  getNavigationLinks(): Observable<SecondaryNavigationLink[]> {
    return this.navigationLinks.asObservable();
  }

  getIsMobileNavigationOpen(): Observable<boolean> {
    return this.isMobileNavigationOpen.asObservable();
  }

  toggleMobileNavigationState() {
    this.isMobileNavigationOpen.next(!this.isMobileNavigationOpen.value);
  }

  getNavigationVisibility(): Observable<boolean> {
    return this.isNavigationVisible.asObservable();
  }

  setNavigationVisibility(isVisible: boolean) {
    this.isNavigationVisible.next(isVisible);
  }
}
