import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DownloadService } from './download.service';
import { LearnerService } from './../../../../services/learner/learner.service';
import { DashboardUtilsService } from './../dashboard-utils.service';

describe('DownloadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientModule, DownloadService, LearnerService, DashboardUtilsService]
    });
  });

  it('should be created', inject([DownloadService], (service: DownloadService) => {
    expect(service).toBeTruthy();
    const res = { "id": "api.sunbird.dashboard.org.creation", "ver": "v1", "ts": "2018-02-21 06:41:32:574+0000", "params": { "resmsgid": null, "msgid": "1ef681f0-a158-46eb-b2eb-ee4c74b4fecd", "err": null, "status": "success", "errmsg": null }, "responseCode": "OK", "result": { "requestId": "0124452555998003206" } };
  }));

  it('should call learner service', inject([DownloadService, LearnerService, DashboardUtilsService], (service: DownloadService, LearnerService, DashboardUtilsService) => {
    let reqData = {
      data: { identifier: 'do_123', timePeriod: '7d' },
      dataset: 'COURSE_CONSUMPTION'
    }
    service.getReport(reqData)
    expect(service).toBeTruthy();
    expect(DashboardUtilsService).toBeTruthy();
    expect(LearnerService).toBeTruthy();
  }));
});
