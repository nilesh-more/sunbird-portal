import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseConsumptionComponent } from './course-consumption.component';

describe('CourseConsumptionComponent', () => {
  let component: CourseConsumptionComponent;
  let fixture: ComponentFixture<CourseConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
