import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceStatusCheckFormComponent } from './device-status-check-form.component';

describe('DeviceStatusCheckFormComponent', () => {
  let component: DeviceStatusCheckFormComponent;
  let fixture: ComponentFixture<DeviceStatusCheckFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceStatusCheckFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceStatusCheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
