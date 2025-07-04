import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionsParticipants } from './live-sessions-participants';

describe('LiveSessionsParticipants', () => {
  let component: LiveSessionsParticipants;
  let fixture: ComponentFixture<LiveSessionsParticipants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSessionsParticipants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSessionsParticipants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
