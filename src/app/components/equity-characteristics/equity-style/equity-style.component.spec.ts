import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityStyleComponent } from './equity-style.component';

describe('EquityStyleComponent', () => {
  let component: EquityStyleComponent;
  let fixture: ComponentFixture<EquityStyleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquityStyleComponent]
    });
    fixture = TestBed.createComponent(EquityStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
