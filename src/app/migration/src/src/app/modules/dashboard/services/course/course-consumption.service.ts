import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { LearnerService } from './../../../../services/learner/learner.service';
import { DashboardUtilsService } from './../dashboard-utils.service';
import * as _ from 'lodash';

interface RequestParam {
  data: object;
  dataset?: string;
}

@Injectable()

/**
 * Service to get course consumption data
 */
export class CourseConsumptionService {
  blockData: any;

  /**
   * Constructor to create injected service object
   */
  constructor(private LearnerService: LearnerService, private DashboardUtil: DashboardUtilsService) {
  }

  /**
   * Function to get course consumption data.
   * Internally calls the learner service to make api call 
   */
  getDashboardData(requestParam: RequestParam) {
    const paramOptions = {
      url: this.DashboardUtil.constructDashboardApiUrl(requestParam.data, 'COURSE_CONSUMPTION')
    };

    return this.LearnerService.get(paramOptions)
      .map((data: any) => {
        return this.parseApiResponse(data)
      })
      .catch((err) => {
        return Observable.throw(err)
      })
  }

  /**
   * Function to parse course consumption api response
   */
  parseApiResponse(data: any) {
    this.blockData = [];
    _.forEach(data.result.snapshot, (numericData, key) => {
      switch (key) {
        case 'course.consumption.time_spent.count':
        case 'course.consumption.time_spent_completion_count':
          this.blockData.push(this.DashboardUtil.secondToMinConversion(numericData))
          break
        default:
          this.blockData.push(numericData)
      }
    })

    return {
      bucketData: data.result.series,
      numericData: this.blockData,
      series: ''
    }
  }
}
