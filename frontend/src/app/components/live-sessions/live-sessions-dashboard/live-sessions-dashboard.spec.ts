import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionsDashboard } from './live-sessions-dashboard';

describe('LiveSessionsDashboard', () => {
  let component: LiveSessionsDashboard;
  let fixture: ComponentFixture<LiveSessionsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSessionsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSessionsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
