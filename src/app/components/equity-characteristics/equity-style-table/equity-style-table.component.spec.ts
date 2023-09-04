import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityStyleTableComponent } from './equity-style-table.component';

describe('EquityStyleTableComponent', () => {
  let component: EquityStyleTableComponent;
  let fixture: ComponentFixture<EquityStyleTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquityStyleTableComponent]
    });
    fixture = TestBed.createComponent(EquityStyleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
