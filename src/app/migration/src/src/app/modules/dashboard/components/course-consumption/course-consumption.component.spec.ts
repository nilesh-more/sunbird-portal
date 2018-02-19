// NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from './../../../common/common.module';
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
import { ResourceService } from './../../../../services/resource/resource.service';
// 
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

describe('CourseConsumptionComponent', () => {
  let component: CourseConsumptionComponent;
  let fixture: ComponentFixture<CourseConsumptionComponent>;
  let router: Router;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) }
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CourseConsumptionComponent],
      imports: [HttpClientTestingModule,
        FormsModule,
        SuiModule,
        ChartsModule,
        AppCommonModule],
      providers: [HttpClientModule, CourseConsumptionService,
        RendererService,
        LearnerService,
        ContentService,
        UserService,
        SearchService,
        LineChartService,
        DashboardUtilsService,
        ResourceService,
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
    router = TestBed.get(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search api and returns result count 1', inject([SearchService], (SearchService) => {
    const mockResponse = { "id": "api.v1.search", "responseCode": "OK", "result": { "count": 65, "content": [{ "identifier": "do_2124339707713126401772", "name": "course" }] } }
    spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.showError).toEqual(false)
    expect(component.myCoursesList).toBeDefined();
    expect(component.myCoursesList.length).toEqual(1);
    expect(component.identifier).toEqual('do_2124339707713126401772');
    expect(component.isMultipleCourses).toEqual(false);
  }));

  // When search api's throw's error
  it('should throw error', inject([SearchService], (SearchService) => {
    spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.throw({}));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.blockData.length).toBeLessThanOrEqual(0)
    expect(component.myCoursesList.length).toEqual(0)
    expect(component.showError).toEqual(true)
  }));

  // If search api returns more than one course
  it('should call search api and returns result count more than 1', inject([SearchService], (SearchService) => {
    component.isMultipleCourses = false;
    const mockResponse = { "id": "api.v1.search", "responseCode": "OK", "result": { "count": 65, "content": [{ "identifier": "do_2124339707713126401772", "name": "course" }, { "identifier": "do_2124339707713126401772", "name": "course" }] } }
    spyOn(SearchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.showError).toEqual(false);
    expect(component.myCoursesList).toBeDefined();
    expect(component.isMultipleCourses).toEqual(true);
    expect(component.myCoursesList.length).toBeGreaterThan(1)
  }));

  // When course consumption api's return response 
  it('should call dashboard api and return valid response', inject([CourseConsumptionService, SearchService, RendererService], (CourseConsumptionService, SearchService, RendererService) => {
    const mockResponse = { "bucketData": { "course.consumption.time_spent": { "name": "Timespent for content consumption", "split": "content.sum(time_spent)", "time_unit": "seconds", "group_id": "course.timespent.sum", "buckets": [{ "key": 1518423367265, "key_name": "2018-02-12", "value": 0 }, { "key": 1518509767265, "key_name": "2018-02-13", "value": 0 }, { "key": 1518596167265, "key_name": "2018-02-14", "value": 0 }, { "key": 1518682567265, "key_name": "2018-02-15", "value": 0 }, { "key": 1518768967265, "key_name": "2018-02-16", "value": 0 }, { "key": 1518855367265, "key_name": "2018-02-17", "value": 0 }, { "key": 1518941767265, "key_name": "2018-02-18", "value": 0 }] }, "course.consumption.content.users.count": { "name": "Number of users by day", "split": "content.users.count", "group_id": "course.users.count", "buckets": [{ "key": 1518423367265, "key_name": "2018-02-12", "value": 0 }, { "key": 1518509767265, "key_name": "2018-02-13", "value": 0 }, { "key": 1518596167265, "key_name": "2018-02-14", "value": 0 }, { "key": 1518682567265, "key_name": "2018-02-15", "value": 0 }, { "key": 1518768967265, "key_name": "2018-02-16", "value": 0 }, { "key": 1518855367265, "key_name": "2018-02-17", "value": 0 }, { "key": 1518941767265, "key_name": "2018-02-18", "value": 0 }] } }, "numericData": [{ "name": "Total time of Content consumption", "time_unit": "seconds", "value": "0 second(s)" }, { "name": "User access course over time", "value": 0 }, { "name": "Total users completed the course", "value": 0 }, { "name": "Average time per user for course completion", "value": "0 second(s)", "time_unit": "seconds" }], "series": "" }
    spyOn(CourseConsumptionService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
    component.getDashboardData('7d', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.blockData.length).toBeGreaterThan(1)
    expect(component.graphData.length).toBeGreaterThanOrEqual(1)
    expect(component.showError).toEqual(false)
    expect(component.showLoader).toEqual(false)
  }));

  it('should call dashboard api and return error', inject([CourseConsumptionService], (CourseConsumptionService) => {
    spyOn(CourseConsumptionService, 'getDashboardData').and.callFake(() => Observable.throw({}));
    component.getDashboardData('', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.showError).toEqual(true)
    expect(component.blockData.length).toEqual(0)
    expect(component.showError).toEqual(true)
    expect(component.showLoader).toEqual(false)
  }));

  it('should call onAfterCourseChange - and load graph', inject([Router], (Router) => {
    component.identifier = 'do_2124319530479697921602';
    let courseDetails = { 'identifier': 'do_2124319530479697921602123' }
    let response = component.onAfterCourseChange(courseDetails)
    fixture.detectChanges();
    expect(component.isMultipleCourses).toBeFalsy();
    expect(Router.navigate).toHaveBeenCalledWith(['migration/dashboard/course/consumption', courseDetails.identifier, '7d']);
  }));

  it('should call onAfterFilterChange function - but should not change time period', inject([Router], (Router) => {
    component.timePeriod = '7d';
    let response = component.onAfterFilterChange('7d')
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(response).toBeFalsy();
    expect(component.timePeriod).toEqual('7d')
    expect(Router.navigate).not.toHaveBeenCalled()
  }));

  it('should call onAfterFilterChange function - and display last 14 days data', inject([Router], (Router) => {
    component.timePeriod = '7d';
    component.identifier = 'do_1234';
    let response = component.onAfterFilterChange('14d')
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(Router.navigate).toHaveBeenCalledWith(['migration/dashboard/course/consumption', component.identifier, '14d']);
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (Router) => {
    component.identifier = 'do_2124319530479697921602'
    let response = component.onAfterCourseChange({ identifier: 'do_2124319530479697921602' })
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier).toEqual('do_2124319530479697921602');
    expect(Router.navigate).not.toHaveBeenCalled()
  }));

  it('should validate identifier and load dashboard data', inject([Router], (Router) => {
    component.invalidUrl = false;
    component.myCoursesList = [{ identifier: 'do_123' }]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(component.invalidUrl).toBeFalsy();
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1)
    expect(Router.navigate).not.toHaveBeenCalled()
  }));

  it('should throw invalidate identifier error', inject([Router], (Router) => {
    component.invalidUrl = false;
    component.myCoursesList = [{ identifier: 'do_1231' }]
    component.validateIdentifier('do_123')
    fixture.detectChanges();
    expect(component.invalidUrl).toBe(true);
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1)
    expect(Router.navigate).toHaveBeenCalledWith(['migration/groups']);
  }));

  it('should display next graph', () => {
    component.showGraph = 0
    component.graphNavigation('next')
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1)
  });
});
