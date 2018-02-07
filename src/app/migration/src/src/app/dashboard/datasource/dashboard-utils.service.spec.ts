import { TestBed, inject } from '@angular/core/testing';
import { DashboardUtilsService } from './dashboard-utils.service';

describe('DashboardUtilsService', () => {
  let basePrefix = 'private/service/';
  let learnerPrefix = 'v1/learner/';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardUtilsService]
    });
  });

  it('should be created', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return zero second', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var numericRes = {'value': 12};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('12 second(s)');
  }));

  it('should return value in a min', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var numericRes = { 'value': 120 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('2.00 min(s)');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var numericRes = { 'value': 3601 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('1.00 hour(s)');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var numericRes = {};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response).toEqual(numericRes);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var req = {'identifier': 'do_123', 'timePeriod': '5w'};
    let progressurl = 'dashboard/v1/creation/org'
    let apiUrl = basePrefix + learnerPrefix + progressurl + '/' + req.identifier + '/export?period=' + req.timePeriod + '&format=csv';
    spyOn(service, 'constructDownloadReportUrl').and.callThrough();
    let response = service.constructDownloadReportUrl(req, 'ORG_CREATION');
    expect(service).toBeTruthy();
    expect(service.constructDownloadReportUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    var req = {'identifier': 'do_123', 'timePeriod': '5w'};
    let progressurl = 'dashboard/v1/creation/org';
    spyOn(service, 'constructApiUrl').and.callThrough();
    let response = service.constructApiUrl(req, 'ORG_CREATION');
    let apiUrl = basePrefix + learnerPrefix + progressurl + '/' + req.identifier + '?period=' + req.timePeriod;
    expect(service).toBeTruthy();
    expect(service.constructApiUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));
});
