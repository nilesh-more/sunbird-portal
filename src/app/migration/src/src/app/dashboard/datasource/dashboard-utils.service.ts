import { Injectable } from '@angular/core';

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
     * @function getData
     */
    constructApiUrl (req, dataset: string){
        let url = this.datasetType['BASE_PREFIX'] + this.datasetType['LEARNER_PREFIX'] +
         this.datasetType[dataset] + '/' + req.identifier + '?period=' + req.timePeriod
        return url
    }

    getDefaultHeaders(){
        let headers = {
            'Content-Type': 'application/json',
            cid: 'sunbird'
        }
        return headers
    }

}
