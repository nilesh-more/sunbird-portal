// Import NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
// Import needed modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
// Import service(s)
import { UserService } from './../../../../services/user/user.service';
import { SearchService } from './../../../../services/search/search.service';
import { DashboardUtilsService } from './../../services/dashboard-utils.service';
import { LineChartService } from './../../services/renderer/graphs/line-chart.service';
import { CourseConsumptionService } from './../../services/course/course-consumption.service';
import { CourseConsumptionComponent } from './course-consumption.component';
import { RendererService } from './../../services/renderer/renderer.service';
import { ContentService } from './../../../../services/content/content.service';
import { LearnerService } from './../../../../services/learner/learner.service';
import * as _ from 'lodash';

describe('CourseConsumptionComponent', () => {
  let component: CourseConsumptionComponent;
  let fixture: ComponentFixture<CourseConsumptionComponent>;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
   
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseConsumptionComponent ],
      imports:[HttpClientTestingModule, FormsModule, SuiModule, ChartsModule],
      providers:[HttpClientModule, CourseConsumptionService, 
        RendererService,
        LearnerService,
        ContentService,
        UserService,
        SearchService, 
        LineChartService, 
        DashboardUtilsService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
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

  it('should call getMyContent function. Api success res - Observable<Any<data>>', inject([SearchService], (SearchService) => {
      // let data = [{id: 'do_1234', name: 'test 1'}];
      // SearchService.setSearchedContent(data)
      const mockResponse = {"id":"api.v1.search","responseCode":"OK","result":{"count":65,"content":[{"identifier":"do_2124339707713126401772","name":"course"}]}}
      spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
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
      component.isMultipleCourses = false;
      const mockResponse = {"id":"api.v1.search","responseCode":"OK","result":{"count":65,"content":[{"identifier":"do_2124339707713126401772","name":"course"},{"identifier":"do_2124339707713126401772","name":"course"}]}}
      spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
      component.getMyContent();
      fixture.detectChanges();
      expect(component.isMultipleCourses).toEqual(true);
  }));

  // When course consumption api's return response 
  it('should call getMyContent function. Api success res - an Observable<Any<err>>', inject([CourseConsumptionService, SearchService], (CourseConsumptionService, SearchService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","responseCode":"OK","result":{"course":{"courseId":"do_2123250076616048641482"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]}}}};
    spyOn(CourseConsumptionService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
  }));

  // When search api's throw's error
  it('should call getMyContent function. Api failed res - an Observable<Any<err>>', inject([SearchService], (SearchService) => {
      spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.throw({}));
      component.getMyContent();
      fixture.detectChanges();
      expect(component.showError).toEqual(true)
  }));

  it('should call getData function to get consumption data. An Observable<Any<err>>', inject([CourseConsumptionService], (CourseConsumptionService) => {
      spyOn(CourseConsumptionService, 'getDashboardData').and.callFake(() => Observable.throw({}));
      component.getDashboardData('', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.showError).toEqual(true)
  }));

  it('should call onAfterCourseChange - and load graph ', () => {
    let courseDetails = [{'identifier':'do_2124319530479697921602123'}]
    component.identifier = 'do_2124319530479697921602'
    let response =  component.onAfterCourseChange(courseDetails)
    fixture.detectChanges();
    expect(component.isMultipleCourses).toBeFalsy();
  }); 

  it('should call onAfterCourseChange function - but should not load graph', () => {
    component.identifier = 'do_2124319530479697921602'
    let response = component.onAfterCourseChange({identifier:'do_2124319530479697921602'})
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should call onAfterFilterChange function - but should not change time period', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('7d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should validateIdentifier', () => {
    component.invalidUrl = false;
    component.myCoursesList = [{identifier: 'do_123'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(component.invalidUrl).toBeFalsy();
  }); 

  it('should validateIdentifier', () => {
    component.invalidUrl = false;
    component.myCoursesList = [{identifier: 'do_1231'}]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(component.invalidUrl).toBe(true);
  }); 

  it('should call onAfterFilterChange function - and display last 14 days data', () => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('14d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
  }); 

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1)
  }); 

  xit('should allow you to observe for changes', function(done) {
    inject([SearchService], (SearchService: SearchService) => {
      let data = [{id: 'do_1234', name: 'test 1'}];
      SearchService.setSearchedContent(data)
      SearchService.searchedContentList = data;
      fixture.detectChanges();
      done();
    })();
  });
});
