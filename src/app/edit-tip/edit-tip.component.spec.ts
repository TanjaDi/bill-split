import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTipComponent } from './edit-tip.component';

describe('EditTiComponent', () => {
  let component: EditTipComponent;
  let fixture: ComponentFixture<EditTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
