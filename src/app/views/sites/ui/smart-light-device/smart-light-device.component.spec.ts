import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLightDeviceComponent } from './smart-light-device.component';

describe('SmartLightDeviceComponent', () => {
  let component: SmartLightDeviceComponent;
  let fixture: ComponentFixture<SmartLightDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartLightDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartLightDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
