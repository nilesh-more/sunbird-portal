// Import NG core modules
import { Injectable } from '@angular/core';
// rxjs packages
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
// Import service(s)
import { LearnerService } from './../../../../services/learner/learner.service';
import { DashboardUtilsService } from './../dashboard-utils.service';
import * as  urlConfig from '../../config/url.config.json';
import * as _ from 'lodash';

interface RequestParam {
  data: object;
  dataset?: string;
}

@Injectable()
/**
 * Service to get organisation creation and consumption data
 */
export class OrganisationService {
  contentStatus: {};
  graphSeries: Array<any> = []
  blockData: Array<any> = []

  /**
   * Constructor to create injected service(s) object
   */
  constructor(private LearnerService: LearnerService, private DashboardUtil: DashboardUtilsService) {
    this.contentStatus = {
      'org.creation.content[@status=published].count': ' LIVE',
      'org.creation.content[@status=draft].count': ' Created',
      'org.creation.content[@status=review].count': ' IN REVIEW'
    }
  }

  /**
   * Function to get organisation creation, consumption dashboard data.
   * Internally calls the learner service to make api call  
   */
  getDashboardData(requestParam: RequestParam) {
    const paramOptions = {
      url: this.DashboardUtil.constructDashboardApiUrl(requestParam.data, requestParam.dataset)
    };

    return this.LearnerService.get(paramOptions)
      .map((data: any) => {
        if (data && data.responseCode === 'OK') {
          return this.parseApiResponse(data, requestParam.dataset);
        } else {
          return Observable.throw(data)
        }
      })
      .catch((err) => {
        return Observable.throw(err)
      })
  }

  /**
   * Function to parse organisation creation and consumption api response
   */
  parseApiResponse(data: any, dataset: string) {
    this.graphSeries = [];
    this.blockData = [];

    _.forEach(data.result.snapshot, (numericData, key) => {
      switch (key) {
        case 'org.creation.authors.count':
        case 'org.creation.reviewers.count':
        case 'org.creation.content.count':
          this.blockData.push(numericData)
          break
        case 'org.consumption.content.time_spent.sum':
        case 'org.consumption.content.time_spent.average':
          this.blockData.push(this.DashboardUtil.secondToMinConversion(numericData))
          break
        default:
          if (dataset === 'ORG_CREATION') {
            this.graphSeries.push(numericData.value + this.contentStatus[key])
          } else {
            this.blockData.push(numericData)
          }
      }
    })

    if (dataset === 'ORG_CREATION') {
      return {
        bucketData: data.result.series, numericData: this.blockData, series: this.graphSeries,
        name: data.result.period === '5w' ? 'Content created per week' : 'Content created per day',
      }
    } else {
      return { bucketData: data.result.series, numericData: this.blockData, series: '' }
    }
  }

}
