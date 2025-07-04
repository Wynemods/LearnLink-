import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionsRoom } from './live-sessions-room';

describe('LiveSessionsRoom', () => {
  let component: LiveSessionsRoom;
  let fixture: ComponentFixture<LiveSessionsRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSessionsRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSessionsRoom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
