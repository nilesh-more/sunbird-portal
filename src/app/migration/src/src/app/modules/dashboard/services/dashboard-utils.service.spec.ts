import { TestBed, inject } from '@angular/core/testing';
import { DashboardUtilsService } from './dashboard-utils.service';
import * as urlConfig from '../../../config/url.config.json';
const urlsConfig = (<any>urlConfig);

describe('DashboardUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardUtilsService]
    });
  });

  it('should be created', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return zero second', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let numericRes = {'value': 12};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('12 second(s)');
  }));

  it('should return value in a min', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let numericRes = { 'value': 120 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('2.00 min(s)');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let numericRes = { 'value': 3601 };
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response.value).toEqual('1.00 hour(s)');
  }));

  it('should return value in a hour', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let numericRes = {};
    spyOn(service, 'secondToMinConversion').and.callThrough();
    let response = service.secondToMinConversion(numericRes);
    expect(service).toBeTruthy();
    expect(service.secondToMinConversion).toBeDefined();
    expect(response).toEqual(numericRes);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let req = {'identifier': 'do_123', 'timePeriod': '5w'};
    let progressurl = urlsConfig.URLS.DASHBOARD.COURSE_CONSUMPTION;
    let apiUrl = progressurl + '/' + req.identifier + '?period=' + req.timePeriod;
    spyOn(service, 'constructDashboardApiUrl').and.callThrough();
    let response = service.constructDashboardApiUrl(req, 'COURSE_CONSUMPTION');
    expect(service).toBeTruthy();
    expect(service.constructDashboardApiUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));

  it('should construct valid download report url', inject([DashboardUtilsService], (service: DashboardUtilsService) => {
    let req = {'identifier': 'do_123', 'timePeriod': '5w'};
    let progressurl = urlsConfig.URLS.DASHBOARD.COURSE_CONSUMPTION;
    let apiUrl = progressurl + '/' + req.identifier + '/export?period=' + req.timePeriod + '&format=csv';
    spyOn(service, 'constructDownloadReportApiUrl').and.callThrough();
    let response = service.constructDownloadReportApiUrl(req, 'COURSE_CONSUMPTION');
    expect(service).toBeTruthy();
    expect(service.constructDownloadReportApiUrl).toBeDefined();
    expect(response).toEqual(apiUrl);
  }));

});
