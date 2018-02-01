import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service'
import { HttpClient } from '@angular/common/http';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'


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
        let dd = this.get(URL, headers)
        this.get(URL, headers).subscribe(
        data => {
            alert('success')
            console.log('API-Response', data)
        },
        err => {
            alert('error')
            console.log('error in getting permission===== gggggggggggggg ==================', err);
        }
        );
    }

}
