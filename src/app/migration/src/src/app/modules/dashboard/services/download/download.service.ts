import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { LearnerService } from './../../../../services/learner/learner.service';
import { DashboardUtilsService } from './../dashboard-utils.service';

interface RequestParam {
  data: object;
  dataset?: string;
}

@Injectable()
export class DownloadService {

  constructor(private LearnerService: LearnerService, private DashboardUtil: DashboardUtilsService) { }

  downloadReport(requestParam: RequestParam) {
    const requestBody = {
      url: this.DashboardUtil.constructDownloadReportApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.LearnerService.get(requestBody)
  }

}
