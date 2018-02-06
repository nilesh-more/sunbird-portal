import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DashboardUtilsService  {
    datasetType: {}
    constructor() {
        this.datasetType = {
            'BASE_PREFIX':'private/service/',
            'LEARNER_PREFIX':'v1/learner/',
            'ORG_CREATION': 'dashboard/v1/creation/org',
            'ORG_CONSUMPTION': 'dashboard/v1/consumption/org',
            'COURSE_PROGRESS': 'dashboard/v1/progress/course',
            'COURSE_CONSUMPTION': 'dashboard/v1/consumption/course'
        }
    }

	/**
	 * @function constructApiUrl
	 * @desc construct required api url
	 * @param {object} req
	 * @param {string} dataset
	 */
    constructApiUrl (req, dataset: string){
        let url = this.datasetType['BASE_PREFIX'] + this.datasetType['LEARNER_PREFIX'] +
         this.datasetType[dataset] + '/' + req.identifier + '?period=' + req.timePeriod
        return url
    }

	/**
	 * @function getDefaultHeaders
	 * @desc create dedault headers
	 */
    getDefaultHeaders(){
        let headers = {
            'Content-Type': 'application/json',
            cid: 'sunbird'
        }
        return headers
    }

	/**
	 * @function secondToMinConversion
	 * @desc construct required api url
	 * @param {object} numericData
	 * @return {object} 
	 */
    secondToMinConversion(numericData){
        console.log('numericData', numericData)
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
