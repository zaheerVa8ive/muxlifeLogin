import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartBlindComponent } from './smart-blind.component';

describe('SmartBlindComponent', () => {
  let component: SmartBlindComponent;
  let fixture: ComponentFixture<SmartBlindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartBlindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartBlindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
