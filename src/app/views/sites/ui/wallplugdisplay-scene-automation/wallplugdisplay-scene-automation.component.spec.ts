import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallplugdisplaySceneAutomationComponent } from './wallplugdisplay-scene-automation.component';

describe('WallplugdisplaySceneAutomationComponent', () => {
  let component: WallplugdisplaySceneAutomationComponent;
  let fixture: ComponentFixture<WallplugdisplaySceneAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallplugdisplaySceneAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallplugdisplaySceneAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
