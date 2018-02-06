import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { ChartsModule } from 'ng2-charts';
import { CourseConsumptionDashboardComponent } from './course-consumption.component';
import { CourseConsumptionService } from '../../dashboard/datasource/course-consumption.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user/user.service';


describe('CourseConsumptionDashboardComponent', () => {
  let component: CourseConsumptionDashboardComponent;
  let fixture: ComponentFixture<CourseConsumptionDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, HttpModule, FormsModule, SuiModule, ChartsModule],
      declarations: [ CourseConsumptionDashboardComponent ],
      providers:[HttpClientModule, CourseConsumptionService, DashboardUtilsService, SearchService, UserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ===========================================================================================================================================', () => {
    expect(component).toBeTruthy();
  });

  it('should call getData function', () => {
    expect(component.timePeriod).toBeDefined();
    expect(component.identifier).toBeDefined();
    expect(component.courseName).toBeDefined();
    expect(component.chartType).toBeDefined();
    expect(component.isMultipleCourses).toBeDefined();
    component.getData('7d','do_2124319530479697921602')
  });  

  it('should should call onAfterCourseChange', () => {
    let courseDetails = [{identifier:'do_2124319530479697921602'}, {identifier:'do_2124319530239697921602'}]
    let response = component.identifier = 'do_2124319530479697921602'
    component.onAfterCourseChange(courseDetails)
    //expect(response).toEqual()
  }); 

});
