import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmerSocketComponent } from './dimmer-socket.component';

describe('DimmerSocketComponent', () => {
  let component: DimmerSocketComponent;
  let fixture: ComponentFixture<DimmerSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimmerSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimmerSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
