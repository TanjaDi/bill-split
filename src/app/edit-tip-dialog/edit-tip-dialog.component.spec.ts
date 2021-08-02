import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTipDialogComponent } from './edit-tip-dialog.component';

describe('EditTipDialogComponent', () => {
  let component: EditTipDialogComponent;
  let fixture: ComponentFixture<EditTipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTipDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
