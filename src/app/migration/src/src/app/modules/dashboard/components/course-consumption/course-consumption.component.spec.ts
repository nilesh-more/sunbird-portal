// NG core testing module(s)
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// Modules
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
// SB components and service
import { CourseConsumptionComponent, DashboardUtilsService, LineChartService,
  CourseConsumptionService, RendererService, AppCommonModule
} from './../../index';
import { ResourceService, UserService, SearchService, ContentService } from './../../../../services';


import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

describe('CourseConsumptionComponent', () => {
  let component: CourseConsumptionComponent;
  let fixture: ComponentFixture<CourseConsumptionComponent>;
  let router: Router;
  const fakeActivatedRoute = { 'params': Observable.from([{ 'id': 1, 'timePeriod': '7d' }]) };
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
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call search api and returns result count 1', inject([SearchService], (searchService) => {
    const mockResponse = { 'id': 'api.v1.search', 'responseCode': 'OK', 'result': { 'count': 65, 'content': [{ 'identifier':
    'do_2124339707713126401772', 'name': 'course' }] } };
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.showError).toEqual(false);
    expect(component.myCoursesList).toBeDefined();
    expect(component.myCoursesList.length).toEqual(1);
    expect(component.identifier).toEqual('do_2124339707713126401772');
    expect(component.isMultipleCourses).toEqual(false);
  }));

  // When search api's throw's error
  it('should throw error', inject([SearchService], (searchService) => {
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.throw({}));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.blockData.length).toBeLessThanOrEqual(0);
    expect(component.myCoursesList.length).toEqual(0);
    expect(component.showError).toEqual(true);
  }));

  // If search api returns more than one course
  it('should call search api and returns result count more than 1', inject([SearchService], (searchService) => {
    component.isMultipleCourses = false;
    const mockResponse = { 'id': 'api.v1.search', 'responseCode': 'OK', 'result': { 'count': 65, 'content':
    [{ 'identifier': 'do_2124339707713126401772', 'name': 'course' }, { 'identifier': 'do_2124339707713126401772', 'name': 'course' }] } };
    spyOn(searchService, 'searchContentByUserId').and.callFake(() => Observable.of(mockResponse));
    component.getMyContent();
    fixture.detectChanges();
    expect(component.showError).toEqual(false);
    expect(component.myCoursesList).toBeDefined();
    expect(component.isMultipleCourses).toEqual(true);
    expect(component.myCoursesList.length).toBeGreaterThan(1);
  }));

  // When course consumption api's return response
  it('should call dashboard api and return valid response', inject([CourseConsumptionService],
    (courseConsumptionService) => {
      const mockResponse = { 'bucketData': { 'course.consumption.time_spent': { 'name': 'Timespent for content consumption',
      'split': 'content.sum(time_spent)', 'time_unit': 'seconds', 'group_id': 'course.timespent.sum', 'buckets':
      [{ 'key': 1518423367265, 'key_name': '2018-02-12', 'value': 0 }, { 'key': 1518509767265, 'key_name': '2018-02-13', 'value': 0 },
      { 'key': 1518596167265, 'key_name': '2018-02-14', 'value': 0 }, { 'key': 1518682567265, 'key_name': '2018-02-15',
      'value': 0 }, { 'key': 1518768967265, 'key_name': '2018-02-16', 'value': 0 }, { 'key': 1518855367265, 'key_name':
      '2018-02-17', 'value': 0 }, { 'key': 1518941767265, 'key_name': '2018-02-18', 'value': 0 }] },
      'course.consumption.content.users.count': { 'name': 'Number of users by day', 'split': 'content.users.count',
      'group_id': 'course.users.count', 'buckets': [{ 'key': 1518423367265, 'key_name': '2018-02-12', 'value': 0 }, { 'key': 1518509767265,
      'key_name': '2018-02-13', 'value': 0 }, { 'key': 1518596167265, 'key_name': '2018-02-14', 'value': 0 }, { 'key': 1518682567265,
      'key_name': '2018-02-15', 'value': 0 }, { 'key': 1518768967265, 'key_name': '2018-02-16', 'value': 0 }, { 'key': 1518855367265,
      'key_name': '2018-02-17', 'value': 0 }, { 'key': 1518941767265, 'key_name': '2018-02-18', 'value': 0 }] } }, 'numericData':
      [{ 'name': 'Total time of Content consumption', 'time_unit': 'seconds', 'value': '0 second(s)' }, { 'name':
      'User access course over time', 'value': 0 }, { 'name': 'Total users completed the course', 'value': 0 }, { 'name':
      'Average time per user for course completion', 'value': '0 second(s)', 'time_unit': 'seconds' }], 'series': '' };
      spyOn(courseConsumptionService, 'getDashboardData').and.callFake(() => Observable.of(mockResponse));
      component.getDashboardData('7d', 'do_2123250076616048641482');
      fixture.detectChanges();
      expect(component.blockData.length).toBeGreaterThan(1);
      expect(component.graphData.length).toBeGreaterThanOrEqual(1);
      expect(component.showError).toEqual(false);
      expect(component.showLoader).toEqual(false);
  }));

  it('should call dashboard api and return error', inject([CourseConsumptionService], (courseConsumptionService) => {
    spyOn(courseConsumptionService, 'getDashboardData').and.callFake(() => Observable.throw({}));
    component.getDashboardData('', 'do_2123250076616048641482');
    fixture.detectChanges();
    expect(component.showError).toEqual(true);
    expect(component.blockData.length).toEqual(0);
    expect(component.showError).toEqual(true);
    expect(component.showLoader).toEqual(false);
  }));

  it('should call onAfterCourseChange - and load graph', inject([Router], (route) => {
    component.identifier = 'do_2124319530479697921602';
    const courseDetails = { 'identifier': 'do_2124319530479697921602123' };
    const response = component.onAfterCourseChange(courseDetails);
    fixture.detectChanges();
    expect(component.isMultipleCourses).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['migration/dashboard/course/consumption', courseDetails.identifier, '7d']);
  }));

  it('should call onAfterFilterChange function - but should not change time period', inject([Router], (route) => {
    component.timePeriod = '7d';
    const response = component.onAfterFilterChange('7d');
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(response).toBeFalsy();
    expect(component.timePeriod).toEqual('7d');
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should call onAfterFilterChange function - and display last 14 days data', inject([Router], (route) => {
    component.timePeriod = '7d';
    component.identifier = 'do_1234';
    const response = component.onAfterFilterChange('14d');
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(route.navigate).toHaveBeenCalledWith(['migration/dashboard/course/consumption', component.identifier, '14d']);
  }));

  it('should call onAfterCourseChange function - but should not load graph', inject([Router], (route) => {
    component.identifier = 'do_2124319530479697921602';
    const response = component.onAfterCourseChange({ identifier: 'do_2124319530479697921602' });
    fixture.detectChanges();
    expect(response).toBeFalsy();
    expect(component.identifier).toEqual('do_2124319530479697921602');
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should validate identifier and load dashboard data', inject([Router], (route) => {
    component.myCoursesList = [{ identifier: 'do_123' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1);
    expect(route.navigate).not.toHaveBeenCalled();
  }));

  it('should throw invalidate identifier error', inject([Router], (route) => {
    component.myCoursesList = [{ identifier: 'do_1231' }];
    component.validateIdentifier('do_123');
    fixture.detectChanges();
    expect(component.myCoursesList.length).toBeGreaterThanOrEqual(1);
    expect(route.navigate).toHaveBeenCalledWith(['migration/groups']);
  }));

  it('should display next graph', () => {
    component.showGraph = 0;
    component.graphNavigation('next');
    fixture.detectChanges();
    expect(component.showGraph).toEqual(1);
  });
});
