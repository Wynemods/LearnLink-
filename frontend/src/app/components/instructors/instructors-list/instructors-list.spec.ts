import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsList } from './instructors-list';

describe('InstructorsList', () => {
  let component: InstructorsList;
  let fixture: ComponentFixture<InstructorsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
