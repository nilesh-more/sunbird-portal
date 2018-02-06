import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseConsumptionDashboardComponent } from './course-consumption.component';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service';


describe('CourseConsumptionDashboardComponent', () => {
  let component: CourseConsumptionDashboardComponent;
  let fixture: ComponentFixture<CourseConsumptionDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create =================================================', () => {
    expect(component).toBeTruthy();
  });
});
