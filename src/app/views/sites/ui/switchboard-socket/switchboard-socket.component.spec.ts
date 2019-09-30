import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchboardSocketComponent } from './switchboard-socket.component';

describe('SwitchboardSocketComponent', () => {
  let component: SwitchboardSocketComponent;
  let fixture: ComponentFixture<SwitchboardSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchboardSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchboardSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
