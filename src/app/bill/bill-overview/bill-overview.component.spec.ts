import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOverviewComponent } from './bill-overview.component';

describe('BillOverviewComponent', () => {
  let component: BillOverviewComponent;
  let fixture: ComponentFixture<BillOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
