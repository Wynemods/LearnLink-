import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionsControls } from './live-sessions-controls';

describe('LiveSessionsControls', () => {
  let component: LiveSessionsControls;
  let fixture: ComponentFixture<LiveSessionsControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSessionsControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSessionsControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
