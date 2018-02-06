import { TestBed, inject, async } from '@angular/core/testing';

import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from './search.service';
import { UserService } from './user/user.service';
import { MockBackend } from "@angular/http/testing";


describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpModule],
      providers: [HttpClientModule, UserService, SearchService, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([SearchService, XHRBackend], (service: SearchService, mockBackend) => {
    var dd = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-02-05 12:50:09:866+0000","params":{"resmsgid":null,"msgid":"d65183f0-9f03-4a9c-b1e3-efa23546b8d0","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2124318148609228801299"},"period":"5w","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":"20182","key_name":"2018-01-08 To 2018-01-14","value":0},{"key":"20183","key_name":"2018-01-15 To 2018-01-21","value":0},{"key":"20184","key_name":"2018-01-22 To 2018-01-28","value":0},{"key":"20185","key_name":"2018-01-29 To 2018-02-04","value":0},{"key":"20186","key_name":"2018-02-05 To 2018-02-11","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by week","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":"20182","key_name":"2018-01-08 To 2018-01-14","value":0},{"key":"20183","key_name":"2018-01-15 To 2018-01-21","value":0},{"key":"20184","key_name":"2018-01-22 To 2018-01-28","value":0},{"key":"20185","key_name":"2018-01-29 To 2018-02-04","value":0},{"key":"20186","key_name":"2018-02-05 To 2018-02-11","value":0}]}}}};
    mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(dd)
          })));
        });

      service.getMyContent([],[],[]).subscribe((data) => {
          expect(data.result.period).toEqual('5w');
      });


      // expect(service.getMyContent([],[],[])).toBeTruthy();
  }));
  
});
