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
import { RendererService } from '../../dashboard/renderer/renderer.service';
import { LineChartService } from '../../dashboard/renderer/graph/lineChart.service';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user/user.service';


describe('CourseConsumptionDashboardComponent', () => {
  let component: CourseConsumptionDashboardComponent;
  let fixture: ComponentFixture<CourseConsumptionDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, HttpModule, FormsModule, SuiModule, ChartsModule],
      declarations: [ CourseConsumptionDashboardComponent ],
      providers:[HttpClientModule, 
        CourseConsumptionService,
        DashboardUtilsService,
        RendererService,
        LineChartService,
        SearchService, 
        UserService]
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

  it('should call onAfterCourseChange function - but should not load graph', () => {
    component.identifier = 'do_2124319530479697921602'
    let courseDetails = [{identifier:'do_2124319530479697921602'}]
    let response = component.onAfterCourseChange(courseDetails)
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterCourseChange - and load graph ', () => {
    let courseDetails = [{'identifier':'do_2124319530479697921602123'}]
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterCourseChange(courseDetails)
    expect(component.isMultipleCourses).toBeFalsy();
  }); 

  it('should call onAfterFilterChange function - but should not change time period', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('7d')
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterFilterChange - and load graph ', () => {
    component.timePeriod = '7d';
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterFilterChange('14d')
    expect(component.timePeriod).toEqual('14d')
  }); 

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    expect(component.showGraph).toEqual(1)
  }); 

});
