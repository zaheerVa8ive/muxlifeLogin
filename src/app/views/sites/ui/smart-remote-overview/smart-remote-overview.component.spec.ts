import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRemoteOverviewComponent } from './smart-remote-overview.component';

describe('SmartRemoteOverviewComponent', () => {
  let component: SmartRemoteOverviewComponent;
  let fixture: ComponentFixture<SmartRemoteOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartRemoteOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartRemoteOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
