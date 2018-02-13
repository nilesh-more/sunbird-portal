import { Injectable, Input } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import * as  urlConfig from '../../config/url.config.json';
const urlsConfig = (<any>urlConfig);

interface RequestParam {
	status?: any;
	contentType?: any;
	params?: any;
	orgid?: any;
}

@Injectable()

/**
 * Service to search content/courses/textbook
 */
export class SearchService {

	contentList: any;
	contentCreateByMe: any;
	organisationList: any;
	/**
	 * Constructor to create object of injected service(s)
	 */
	constructor(private UserService: UserService, private ContentService: ContentService) { }

	/**
	 * Function to search content
	 */
	searchContentByUserId(requestParam: RequestParam) {
		// TODO: before pushing remove this hardcode user id 
		requestParam.params.userId = 'b14e7747-e66d-49f3-8152-7a6706f0b530';

		const option = {
			url: urlsConfig.URLS.COMPOSITE.SEARCH,
			data: {
				request: {
					filters: {
						status: requestParam.status || ['Live'],
						createdBy: requestParam.params.userId ? requestParam.params.userId : this.UserService.userid,
						contentType: requestParam.contentType || ['Course']
					},
					sort_by: {
						lastUpdatedOn: requestParam.params.lastUpdatedOn || 'desc'
					},
					limit: 100
				}
			}
		};

		return this.ContentService.post(option)
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

    public setContent(data: any): void {
        this.contentList = data;
    }

    public getContent(): any {
        return this.contentList;
    }

	getOrganisationDetails(requestParam: RequestParam){
		const option = {
			url: urlsConfig.URLS.ADMIN.ORG_SEARCH,
			data: {
				request: {
					filters: {
						id: requestParam.orgid,
					}
				}
			}
		};

		return this.ContentService.post(option)
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

    public setOrganisation(data: any): void {
        this.organisationList = data;
    }

    public getOrganisation(): any {
        return this.organisationList;
    }
}
