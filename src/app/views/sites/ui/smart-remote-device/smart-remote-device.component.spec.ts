import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRemoteDeviceComponent } from './smart-remote-device.component';

describe('SmartRemoteDeviceComponent', () => {
  let component: SmartRemoteDeviceComponent;
  let fixture: ComponentFixture<SmartRemoteDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartRemoteDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartRemoteDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
