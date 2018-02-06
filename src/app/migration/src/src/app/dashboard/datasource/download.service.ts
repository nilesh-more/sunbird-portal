import { Injectable } from '@angular/core';
import { DataService } from '../../services/data/data.service'
import { HttpClient } from '@angular/common/http';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DownloadService extends DataService  {
    constructor(
        public http: HttpClient,
        public DashboardUtils: DashboardUtilsService
        ) {
        super(http)
    }

    /**
     * @function getData
     */
    getDownloadData (apiReq: object, datasetType: string){
        let headers: object = this.DashboardUtils.getDefaultHeaders()
        const option = {
            url: this.DashboardUtils.constructDownloadReportUrl(apiReq, datasetType)
        }
        return this.get(option)
            .map((data: any) => {
                console.log('Dashboard data received: in datasource', data)
                if (data && data.responseCode === 'OK') {
                    return data.result
                } else {
                    return Observable.throw(data)
                }
            })
            .catch((err) => {
                return Observable.throw(err)
            })
    }
}
