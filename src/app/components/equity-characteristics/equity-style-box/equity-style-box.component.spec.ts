import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityStyleBoxComponent } from './equity-style-box.component';

describe('EquityStyleBoxComponent', () => {
  let component: EquityStyleBoxComponent;
  let fixture: ComponentFixture<EquityStyleBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquityStyleBoxComponent]
    });
    fixture = TestBed.createComponent(EquityStyleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
