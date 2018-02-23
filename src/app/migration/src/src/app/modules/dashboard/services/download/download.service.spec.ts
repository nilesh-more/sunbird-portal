import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadService, DashboardUtilsService } from './../';
import { LearnerService } from './../../../../services';

describe('DownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, DownloadService, LearnerService, DashboardUtilsService]
    });
  });

  it('should be created', inject([DownloadService], (service: DownloadService) => {
    expect(service).toBeTruthy();
    const res = {
      'id': 'api.sunbird.dashboard.org.creation', 'ver': 'v1', 'responseCode': 'OK',
      'result': { 'requestId': '0124452555998003206' }
    };
  }));

  it('should call learner service', inject([DownloadService, LearnerService, DashboardUtilsService],
    (service: DownloadService, learnerService, dashboardUtilsService) => {
      const reqData = {
        data: { identifier: 'do_123', timePeriod: '7d' },
        dataset: 'COURSE_CONSUMPTION'
      };
      service.getReport(reqData);
      expect(service).toBeTruthy();
      expect(dashboardUtilsService).toBeTruthy();
      expect(learnerService).toBeTruthy();
    }));
});
