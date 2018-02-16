import { DataService } from './../../../services/data/data.service';
import { DashboardUtilsService } from './dashboard-utils.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Rx';

import { LearnerService } from './../../../services/learner/learner.service';
import { DashboardService } from './dashboard.service';
// import { LearnerService }

describe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[HttpClientTestingModule, HttpModule],
        providers: [DashboardService, LearnerService, Http, DashboardUtilsService]
    });
  });

  it('should be created', inject([DashboardService], (service: DashboardService) => {
    expect(service).toBeTruthy();
  }));


  // TODO: need to add more assertion 
  it('should make api call', inject([DashboardService, DashboardUtilsService, LearnerService], (service: DashboardService, 
    DashboardUtilsService: DashboardUtilsService, LearnerService: LearnerService) => {
    const params = { data: { identifier: 'do_2123250076616048641482', timePeriod: '7d' } };
    const mockResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","responseCode":"OK","result":{"course":{"courseId":"do_2123250076616048641482"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1517203102887,"key_name":"2018-01-29","value":0},{"key":1517289502887,"key_name":"2018-01-30","value":0},{"key":1517375902887,"key_name":"2018-01-31","value":0},{"key":1517462302887,"key_name":"2018-02-01","value":0},{"key":1517548702887,"key_name":"2018-02-02","value":0},{"key":1517635102887,"key_name":"2018-02-03","value":0},{"key":1517721502887,"key_name":"2018-02-04","value":0}]}}}};
    spyOn(LearnerService, 'get').and.callFake(() => Observable.throw(mockResponse));
    service.getCourseConsumptionData(params);
    expect(service).toBeTruthy();
  }));

  // TODO: need to add more assertion 
  it('should make api call and get org creation data', inject([DashboardService], (service: DashboardService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.org.creation","ver":"v1","ts":"2018-02-14 19:09:18:555+0000","params":{"resmsgid":null,"msgid":"7687627b-0dbc-4434-8c12-9d0a76b4a6f8","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"Consumption Org","orgId":"01232002070124134414"},"snapshot":{"org.creation.content.count":{"name":"Number of contents created","value":47.0},"org.creation.authors.count":{"name":"Number of authors","value":5},"org.creation.reviewers.count":{"name":"Number of reviewers","value":3},"org.creation.content[@status=draft].count":{"name":"Number of content items created","value":47},"org.creation.content[@status=review].count":{"name":"Number of content items reviewed","value":3},"org.creation.content[@status=published].count":{"name":"Number of content items published","value":8}},"series":{"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","group_id":"org.content.count","buckets":[{"key":1517941800000,"key_name":"2018-02-07","value":7},{"key":1518028200000,"key_name":"2018-02-08","value":9},{"key":1518114600000,"key_name":"2018-02-09","value":9},{"key":1518201000000,"key_name":"2018-02-10","value":5},{"key":1518287400000,"key_name":"2018-02-11","value":7},{"key":1518373800000,"key_name":"2018-02-12","value":5},{"key":1518460200000,"key_name":"2018-02-13","value":5}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","group_id":"org.content.count","buckets":[{"key":1517941800000,"key_name":"2018-02-07","value":0},{"key":1518028200000,"key_name":"2018-02-08","value":1},{"key":1518114600000,"key_name":"2018-02-09","value":0},{"key":1518201000000,"key_name":"2018-02-10","value":1},{"key":1518287400000,"key_name":"2018-02-11","value":0},{"key":1518373800000,"key_name":"2018-02-12","value":1},{"key":1518460200000,"key_name":"2018-02-13","value":0}]},"org.creation.content[@status=published].count":{"name":"Live","split":"content.published_on","group_id":"org.content.count","buckets":[{"key":1517941800000,"key_name":"2018-02-07","value":0},{"key":1518028200000,"key_name":"2018-02-08","value":3},{"key":1518114600000,"key_name":"2018-02-09","value":2},{"key":1518201000000,"key_name":"2018-02-10","value":3},{"key":1518287400000,"key_name":"2018-02-11","value":0},{"key":1518373800000,"key_name":"2018-02-12","value":0},{"key":1518460200000,"key_name":"2018-02-13","value":0}]}}}};
    let response = service.parseOrgDashboardData(mockResponse.result, 'ORG_CREATION');
    expect(service).toBeTruthy();
    // expect(response).toEqual(mockResponse.result.series);
    expect(response.numericData.length).toBeGreaterThan(2);
    expect(response.series).toMatch('')
  }));

  // TODO: need to add more assertion 
  it('should make api call and get org consumption data', inject([DashboardService], (service: DashboardService) => {
    const mockResponse = {"id":"api.sunbird.dashboard.org.consumption","ver":"v1","ts":"2018-02-14 19:15:22:695+0000","params":{"resmsgid":null,"msgid":"39d3c3ae-9e03-41dc-a4c9-6c504c2c2979","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"Consumption Org","orgId":"01232002070124134414"},"snapshot":{"org.consumption.content.session.count":{"name":"Number of visits by users","value":0},"org.consumption.content.time_spent.sum":{"name":"Content consumption time","value":0.0,"time_unit":"seconds"},"org.consumption.content.time_spent.average":{"name":"Average time spent by user per visit","value":0.0,"time_unit":"seconds"}},"series":{"org.consumption.content.users.count":{"name":"Number of users per day","split":"content.users.count","group_id":"org.users.count","buckets":[{"key":1517579975490,"key_name":"2018-02-02","value":0},{"key":1517666375490,"key_name":"2018-02-03","value":0},{"key":1517752775490,"key_name":"2018-02-04","value":0},{"key":1517839175490,"key_name":"2018-02-05","value":0},{"key":1517925575490,"key_name":"2018-02-06","value":0},{"key":1518011975490,"key_name":"2018-02-07","value":0},{"key":1518098375490,"key_name":"2018-02-08","value":0}]},"org.consumption.content.time_spent.sum":{"name":"Time spent by day","split":"content.time_spent.user.count","time_unit":"seconds","group_id":"org.timespent.sum","buckets":[{"key":1517579975490,"key_name":"2018-02-02","value":0.0},{"key":1517666375490,"key_name":"2018-02-03","value":0.0},{"key":1517752775490,"key_name":"2018-02-04","value":0.0},{"key":1517839175490,"key_name":"2018-02-05","value":0.0},{"key":1517925575490,"key_name":"2018-02-06","value":0.0},{"key":1518011975490,"key_name":"2018-02-07","value":0.0},{"key":1518098375490,"key_name":"2018-02-08","value":0.0}]}}}};
    let response = service.parseOrgDashboardData(mockResponse.result, 'ORG_CONSUMPTION');
    expect(service).toBeTruthy();
    // expect(response).toEqual(mockResponse.result.series);
    expect(response.numericData.length).toBeGreaterThan(2);
    // expect(response.series).toMatch('')
  }));
});
