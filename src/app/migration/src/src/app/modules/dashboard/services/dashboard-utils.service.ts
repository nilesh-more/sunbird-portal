import { Injectable } from '@angular/core';
import * as  urlConfig from '../../../config/url.config.json';
const urlsConfig = (<any>urlConfig);


@Injectable()
export class DashboardUtilsService {
  datasetType: {}

  constructor() { 
    this.datasetType = {
        'ORG_CREATION': urlsConfig.URLS.DASHBOARD.ORG_CREATION,
        'ORG_CONSUMPTION': urlsConfig.URLS.DASHBOARD.ORG_CONSUMPTION,
        'COURSE_PROGRESS': urlsConfig.URLS.DASHBOARD.COURSE_PROGRESS,
        'COURSE_CONSUMPTION': urlsConfig.URLS.DASHBOARD.COURSE_CONSUMPTION
    }
  }

  /**
   * Construct dashboard creation / consumption download api url. 
   * Remove this
   */
  constructDownloadReportApiUrl (req, dataset: string) {
    return this.datasetType[dataset] + '/' + req.identifier + '/export?period=' +
        req.timePeriod + '&format=csv';
  }

  /**
   * Function to construct dashboard api url based on identifier and time period
   */
  constructDashboardApiUrl (req, dataset: string) {
    return this.datasetType[dataset] + '/' + req.identifier + '?period=' + req.timePeriod
  }

  /**
   * Time conversion from second to min(s)
   */
  secondToMinConversion(numericData){
    let num
    if (numericData.value < 60) {
      numericData.value += ' second(s)'
    } else if (numericData.value >= 60 && numericData.value <= 3600) {
      num = numericData.value / 60
      numericData.value = num.toFixed(2) + ' min(s)'
    } else if (numericData.value >= 3600) {
      num = numericData.value / 3600
      numericData.value = num.toFixed(2) + ' hour(s)'
    } else {
      return numericData
    }

    return numericData
  }
}
