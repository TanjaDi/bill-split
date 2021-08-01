import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSplitDialogComponent } from './bill-split-dialog.component';

describe('BillSplitDialogComponent', () => {
  let component: BillSplitDialogComponent;
  let fixture: ComponentFixture<BillSplitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillSplitDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
