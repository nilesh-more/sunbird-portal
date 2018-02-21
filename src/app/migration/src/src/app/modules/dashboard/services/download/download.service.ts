import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { LearnerService } from './../../../../services/learner/learner.service';
import { DashboardUtilsService } from './../dashboard-utils.service';

/**
 * Interface to hold request data
 */
interface RequestParam {
  data: object;
  dataset?: string;
}

/**
 * Service to download dashboard report
 * 
 * It responsible to make http call 
 */
@Injectable()

/**
 * @class DownloadService
 */
export class DownloadService {

  /**
	 * Default method of DownloadService class
   * 
   * @param LearnerService 
   * @param DashboardUtil 
   */
  constructor(private LearnerService: LearnerService, private DashboardUtil: DashboardUtilsService) { }

	/**
	 * Download dashboard report
	 * 
	 * @param {object} requestParam identifier and time period
	 */
  getReport(requestParam: RequestParam) {
    const requestBody = {
      url: this.DashboardUtil.constructDownloadReportApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.LearnerService.get(requestBody)
  }
}
