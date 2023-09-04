import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityCharacteristicsComponent } from './equity-characteristics.component';

describe('EquityCharacteristicsComponent', () => {
  let component: EquityCharacteristicsComponent;
  let fixture: ComponentFixture<EquityCharacteristicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquityCharacteristicsComponent]
    });
    fixture = TestBed.createComponent(EquityCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
