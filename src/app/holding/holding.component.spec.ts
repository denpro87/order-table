import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldingComponent } from './holding.component';

describe('HoldingComponent', () => {
  let component: HoldingComponent;
  let fixture: ComponentFixture<HoldingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoldingComponent]
    });
    fixture = TestBed.createComponent(HoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
