import { Injectable } from '@angular/core';
import { DataService } from '../../services/data/data.service'
import { HttpClient } from '@angular/common/http';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { LearnerService } from './../../services/learner/learner.service';

@Injectable()
export class DownloadService  {
    constructor(
        public http: HttpClient,
        public DashboardUtils: DashboardUtilsService,
        private LearnerService: LearnerService
        ) {
        
    }

	/**
	 * @method getDownloadData
	 * @desc Download report
	 */
    getDownloadData (apiReq: object, datasetType: string){
        const option = {
            url: this.DashboardUtils.constructDownloadReportUrl(apiReq, datasetType)
        }
        return this.LearnerService.get(option)
            .map((data: any) => {
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
