import { Injectable } from '@angular/core';
import { DataService } from '../../services/data/data.service'
import { HttpClient } from '@angular/common/http';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CourseConsumptionService extends DataService  {
    constructor(
        public http: HttpClient,
        public DashboardUtils: DashboardUtilsService
        ) {
        super(http)
    }

    /**
     * @function getData
     * @desc api call to get dashboard data
     * @param {object} apiReq
     * @return {object} data
     */
    getData (apiReq: object){
        let headers: object = this.DashboardUtils.getDefaultHeaders()
        const option = {
            url: this.DashboardUtils.constructApiUrl(apiReq, 'COURSE_CONSUMPTION')
            //param: {}
        };
        return this.get(option)
            .map((data: any) => {
                console.log('Dashboard data received: in datasource', data)
                if (data && data.responseCode === 'OK') {
                    return this.parseApiResponse(data.result)
                } else {
                    return Observable.throw(data)
                }
                
            })
            .catch((err) => {
                return Observable.throw(err)
            })
    }

    /**
     * @function parseApiResponse
     * @desc parse api response
     * @param {object} data
     * @return {object} data
     */
    parseApiResponse(data){
        let blockData: Array<any> = []
        _.forEach(data.snapshot, (numericData, key) => {
            if (key !== 'course.consumption.users_completed') {
                this.DashboardUtils.secondToMinConversion(numericData)
            }
            blockData.push(numericData)
        })
        
        return {
          bucketData: data.series,
          numericData: blockData,
          series: ''
        }
    }
}
