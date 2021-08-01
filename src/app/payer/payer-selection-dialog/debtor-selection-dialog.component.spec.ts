import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtorSelectionDialogComponent } from './debtor-selection-dialog.component';

describe('DebtorSelectionDialogComponent', () => {
  let component: DebtorSelectionDialogComponent;
  let fixture: ComponentFixture<DebtorSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtorSelectionDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtorSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
