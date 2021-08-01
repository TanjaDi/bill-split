import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillEntryDialogComponent } from './edit-bill-entry-dialog.component';

describe('EditBillEntryDialogComponent', () => {
  let component: EditBillEntryDialogComponent;
  let fixture: ComponentFixture<EditBillEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBillEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBillEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
