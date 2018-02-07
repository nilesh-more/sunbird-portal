// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import modules
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { ChartsModule } from 'ng2-charts';

// Import services
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
      imports:[HttpClientTestingModule, FormsModule, SuiModule, ChartsModule],
      declarations: [ CourseConsumptionDashboardComponent ],
      providers:[HttpClientModule, CourseConsumptionService, DashboardUtilsService, RendererService,
      LineChartService, SearchService, UserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseConsumptionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // If search api returns only one content
  it('should call getMyContent function. Api success res - Observable<Any<data>>', inject([SearchService], (SearchService) => {
      const mockResponse = {"id":"api.v1.search","responseCode":"OK","result":{"count":65,"content":[{"identifier":"do_2124339707713126401772","name":"course"}]}}
      spyOn(SearchService, 'getMyContent').and.callFake(() => Observable.of(mockResponse));
      component.getMyContent();
      fixture.detectChanges();
      expect(component.showError).toEqual(false)
      expect(component.myCoursesList).toBeDefined();
      expect(component.myCoursesList.length).toEqual(1);
      expect(component.identifier).toEqual('do_2124339707713126401772');
      expect(component.isMultipleCourses).toEqual(false);
  }));

  // If search api returns more than one course
  it('should call getMyContent function. Api success res - Observable<Any<data>>', inject([SearchService], (SearchService) => {
      const mockResponse = {"id":"api.v1.search","responseCode":"OK","result":{"count":65,"content":[{"identifier":"do_2124339707713126401772","name":"course"},{"identifier":"do_2124339707713126401772","name":"course"}]}}
      spyOn(SearchService, 'getMyContent').and.callFake(() => Observable.of(mockResponse));
      component.getMyContent();
      fixture.detectChanges();
      expect(component.isMultipleCourses).toEqual(true);
  }));

  // When search api's throw's error
  it('should call getMyContent function. Api failed res - an Observable<Any<err>>', inject([SearchService], (SearchService) => {
      spyOn(SearchService, 'getMyContent').and.callFake(() => Observable.throw({}));
      component.getMyContent();
      fixture.detectChanges();
      expect(component.showError).toEqual(true)
  }));

  // When course consumption api's return response 
  it('should call getMyContent function. Api success res - an Observable<Any<err>>', inject([CourseConsumptionService], (CourseConsumptionService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","responseCode":"OK","result":{"course":{"courseId":"do_2123250076616048641482"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]}}}};
    spyOn(CourseConsumptionService, 'getData').and.callFake(() => Observable.of(mockResponse));
    component.getData('', 'do_2123250076616048641482');
    fixture.detectChanges();
  }));

  // When course consumption api's throw's error
  it('should call getData function to get consumption data. An Observable<Any<err>>', inject([CourseConsumptionService], (CourseConsumptionService) => {
      spyOn(CourseConsumptionService, 'getData').and.callFake(() => Observable.throw({}));
      component.getData('', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.showError).toEqual(true)
  }));


  it('should call onAfterCourseChange function - but should not load graph', () => {
    component.identifier = 'do_2124319530479697921602'
    let response = component.onAfterCourseChange({identifier:'do_2124319530479697921602'})
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterCourseChange - and load graph ', () => {
    let courseDetails = [{'identifier':'do_2124319530479697921602123'}]
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterCourseChange(courseDetails)
    fixture.detectChanges();
    expect(component.isMultipleCourses).toBeFalsy();
  }); 

  it('should call onAfterFilterChange function - but should not change time period', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('7d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterFilterChange - and load graph ', () => {
    component.timePeriod = '7d';
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterFilterChange('14d')
    fixture.detectChanges();
    expect(component.timePeriod).toEqual('14d')
  }); 

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1)
  }); 
});
