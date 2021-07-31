import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerSelectionDialogComponent } from './payer-selection-dialog.component';

describe('PayerSelectionDialogComponent', () => {
  let component: PayerSelectionDialogComponent;
  let fixture: ComponentFixture<PayerSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayerSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
