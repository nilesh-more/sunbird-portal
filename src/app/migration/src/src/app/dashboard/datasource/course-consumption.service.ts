import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service'
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
     */
    getData (apiReq: object){
        let URL: string = this.DashboardUtils.constructApiUrl(apiReq, 'COURSE_CONSUMPTION')
        let headers: object = this.DashboardUtils.getDefaultHeaders()
        return this.get(URL, headers)
            .map((data: any) => {
                console.log('Dashboard data received: in datasource', data)
                if (data && data.responseCode === 'OK') {
                    return this.parseApiResponse(data.result)
                } else {
                    return Observable.throw(data)
                }
                
            })
            .catch((err) => {
                let apiRes =  {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
                let res = this.parseApiResponse(apiRes.result)
                return Observable.throw(res)
            })
    }

    parseApiResponse(data){
        let blockData: Array<any> = []
        _.forEach(data.snapshot, function(numericData, key) {
            if (key !== 'course.consumption.users_completed') {
                // this.DashboardUtils.secondToMinConversion(numericData)
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
