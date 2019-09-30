import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationdetailsComponent } from './automationdetails.component';

describe('AutomationdetailsComponent', () => {
  let component: AutomationdetailsComponent;
  let fixture: ComponentFixture<AutomationdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
