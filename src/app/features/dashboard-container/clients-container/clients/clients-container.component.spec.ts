import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsContainerComponent } from '../../../dashboard/clients-container/clients-modal/clients-modal.component';

describe('ClientsContainerComponent', () => {
  let component: ClientsContainerComponent;
  let fixture: ComponentFixture<ClientsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
