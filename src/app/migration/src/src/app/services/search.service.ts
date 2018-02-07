import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data/data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user/user.service';

@Injectable()

/**
 * @class SearchService
 * @desc  get data based on request params
 */
export class SearchService extends DataService {

    serchUrl = ''

    /**
     * @function constructor
     * @param  {HttpClient} publichttp
     */
    constructor(public http: HttpClient, public UserService: UserService) {
        super(http)
        this.serchUrl = ''
    }

    /**
     * @function getMyContent
     * @desc get content by user id
     * @param {} status getMyContent
     * @param {} contentType
     * @param {} params
     * @return object
     */
    getMyContent(status, contentType, params) {
        const option = {
            url: 'private/service/v1/content/composite/v1/search',
            data: {
                request:{
                    filters: {
                        status: status,
                        createdBy: this.UserService.userid,
                        contentType: contentType
                    },
                    sort_by: {
                        lastUpdatedOn: params.lastUpdatedOn || 'desc'
                    }
                }
            }
        };

        return this.post(option)
            .map((data: any) => {
                if (data && data.responseCode === 'OK') {
                    return data
                } else {
                    return Observable.throw(data)
                }
            })
            .catch((err) => {
                return Observable.throw(err)
            })
    }

    /**
     * @function orgSearch
     * @desc get content by user id
     * @param {} status orgSearch
     * @param {} apiRequest
     * @return object
     */
    orgSearch(apiRequest) {
        const option = {
            url: 'private/service/v1/learner/org/v1/search',
            data: apiRequest
        };

        return this.post(option)
            .map((data: any) => {
                if (data && data.responseCode === 'OK') {
                    return data
                } else {
                    return Observable.throw(data)
                }
            })
            .catch((err) => {
                return Observable.throw(err)
            })
    }

}
