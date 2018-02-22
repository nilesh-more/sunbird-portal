// Import NG core testing module
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// Import rxjs packages
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Rx';
// Import service(s)
import { DashboardUtilsService } from './../dashboard-utils.service';
import { LearnerService } from './../../../../services/learner/learner.service';
import { CourseConsumptionService } from './course-consumption.service';

describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseConsumptionService, DashboardUtilsService, LearnerService, HttpClientModule]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  it('should make api call', inject([CourseConsumptionService, DashboardUtilsService, LearnerService], (service: CourseConsumptionService,
    DashboardUtil: DashboardUtilsService, learnerService: LearnerService) => {
    const params = { data: { identifier: 'do_2123250076616048641482', timePeriod: '7d' } };
    const mockResponse = {'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'responseCode': 'OK', 'result':
    {'course': {'courseId': 'do_2123250076616048641482'}, 'period': '7d', 'snapshot': {'course.consumption.time_spent.count':
    {'name': 'Total time of Content consumption', 'time_unit': 'seconds', 'value': 0}, 'course.consumption.time_per_user': {'name':
    'User access course over time', 'value': 0}, 'course.consumption.users_completed': {'name': 'Total users completed the course',
    'value': 0}, 'course.consumption.time_spent_completion_count': {'name': 'Average time per user for course completion', 'value': 0,
    'time_unit': 'seconds'}}, 'series': {'course.consumption.time_spent': {'name': 'Timespent for content consumption', 'split':
    'content.sum(time_spent)', 'time_unit': 'seconds', 'group_id': 'course.timespent.sum', 'buckets': [{'key': 1517203102887,
    'key_name': '2018-01-29', 'value': 0}, {'key': 1517289502887, 'key_name': '2018-01-30', 'value': 0}, {'key': 1517375902887,
    'key_name': '2018-01-31', 'value': 0}, {'key': 1517462302887, 'key_name': '2018-02-01', 'value': 0}, {'key': 1517548702887, 'key_name':
    '2018-02-02', 'value': 0}, {'key': 1517635102887, 'key_name': '2018-02-03', 'value': 0}, {'key': 1517721502887, 'key_name':
    '2018-02-04', 'value': 0}]}, 'course.consumption.content.users.count': {'name': 'Number of users by day', 'split':
    'content.users.count', 'group_id': 'course.users.count', 'buckets': [{'key': 1517203102887, 'key_name': '2018-01-29',
    'value': 0}, {'key': 1517289502887, 'key_name': '2018-01-30', 'value': 0}, {'key': 1517375902887, 'key_name': '2018-01-31',
    'value': 0}, {'key': 1517462302887, 'key_name': '2018-02-01', 'value': 0}, {'key': 1517548702887, 'key_name': '2018-02-02',
    'value': 0}, {'key': 1517635102887, 'key_name': '2018-02-03', 'value': 0}, {'key': 1517721502887, 'key_name': '2018-02-04',
    'value': 0}]}}}};
    spyOn(learnerService, 'get').and.callFake(() => Observable.of(mockResponse));
    service.getDashboardData(params);
    expect(service).toBeTruthy();
    expect(learnerService.get).toHaveBeenCalled();
  }));

  it('should parse course consumption API response', inject([CourseConsumptionService, DashboardUtilsService],
    (service: CourseConsumptionService,
    DashboardUtil: DashboardUtilsService) => {
    const mockResponse = {'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'responseCode': 'OK', 'result': {'course':
    {'courseId': 'do_2123250076616048641482'}, 'period': '7d', 'snapshot': {'course.consumption.time_spent.count':
    {'name': 'Total time of Content consumption', 'time_unit': 'seconds', 'value': 0}, 'course.consumption.time_per_user':
    {'name': 'User access course over time', 'value': 0}, 'course.consumption.users_completed': {'name':
    'Total users completed the course', 'value': 0}, 'course.consumption.time_spent_completion_count': {'name':
    'Average time per user for course completion', 'value': 0, 'time_unit': 'seconds'}}, 'series': {'course.consumption.time_spent':
    {'name': 'Timespent for content consumption', 'split': 'content.sum(time_spent)', 'time_unit': 'seconds', 'group_id':
    'course.timespent.sum', 'buckets': [{'key': 1517203102887, 'key_name': '2018-01-29', 'value': 0}, {'key': 1517289502887,
    'key_name': '2018-01-30', 'value': 0}, {'key': 1517375902887, 'key_name': '2018-01-31', 'value': 0}, {'key': 1517462302887,
    'key_name': '2018-02-01', 'value': 0}, {'key': 1517548702887, 'key_name': '2018-02-02', 'value': 0}, {'key': 1517635102887,
    'key_name': '2018-02-03', 'value': 0}, {'key': 1517721502887, 'key_name': '2018-02-04', 'value': 0}]},
    'course.consumption.content.users.count': {'name': 'Number of users by day', 'split': 'content.users.count',
    'group_id': 'course.users.count', 'buckets': [{'key': 1517203102887, 'key_name': '2018-01-29', 'value': 0},
    {'key': 1517289502887, 'key_name': '2018-01-30', 'value': 0}, {'key': 1517375902887, 'key_name': '2018-01-31',
    'value': 0}, {'key': 1517462302887, 'key_name': '2018-02-01', 'value': 0}, {'key': 1517548702887,
    'key_name': '2018-02-02', 'value': 0}, {'key': 1517635102887, 'key_name': '2018-02-03', 'value': 0}, {'key': 1517721502887,
    'key_name': '2018-02-04', 'value': 0}]}}}};
    const response = service.parseApiResponse(mockResponse);
    expect(service).toBeTruthy();
    expect(response.numericData.length).toBeGreaterThan(1);
  }));
});
