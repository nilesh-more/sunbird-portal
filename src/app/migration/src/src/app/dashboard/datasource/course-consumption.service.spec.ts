import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Rx';
// Services
import { CourseConsumptionService } from './course-consumption.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service';
import { DataService } from '../../services/data/data.service'


describe('CourseConsumptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, HttpModule],
      providers: [CourseConsumptionService, DashboardUtilsService, DataService, Http]
    });
  });

  it('should be created', inject([CourseConsumptionService], (service: CourseConsumptionService) => {
    expect(service).toBeTruthy();
  }));

  // TODO: need to add more assertion 
  it('should make api call', inject([CourseConsumptionService, DataService], (service: CourseConsumptionService, DataService: DataService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","responseCode":"OK","result":{"course":{"courseId":"do_2123250076616048641482"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]}}}};
    spyOn(service, 'getData').and.callThrough()
    spyOn(DataService, 'get').and.callFake(() => Observable.of(mockResponse));
    service.getData({identifier:'do_2123250076616048641482', timePeriod: '7d'})
    expect(service).toBeTruthy();
  }));

  it('should be parse api response', inject([CourseConsumptionService, DataService], (service: CourseConsumptionService, DataService: DataService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","responseCode":"OK","result":{"course":{"courseId":"do_2123250076616048641482"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]}}}};
    spyOn(service, 'parseApiResponse').and.callThrough()
    let response = service.parseApiResponse(mockResponse.result)
    expect(service).toBeTruthy();
    expect(response.bucketData).not.toBeUndefined()
    expect(response.bucketData).toEqual(mockResponse.result.series)
    expect(response.numericData.length).toBeGreaterThanOrEqual(3)
  }));
});
