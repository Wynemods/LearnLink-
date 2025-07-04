import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSessionsCreate } from './live-sessions-create';

describe('LiveSessionsCreate', () => {
  let component: LiveSessionsCreate;
  let fixture: ComponentFixture<LiveSessionsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveSessionsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveSessionsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
