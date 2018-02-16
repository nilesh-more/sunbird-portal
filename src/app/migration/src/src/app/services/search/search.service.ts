import { Injectable, Input } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
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
	searchedContentList: any;
	searchedOrganisationList: any;

	/**
	 * Constructor to create object of injected service(s)
	 */
	constructor(private UserService: UserService, private ContentService: ContentService) { }

	/**
	 * Function to search content by user id.
	 * It takes content status,type,userId as a param and trigger content service to get result 
	 */
	searchContentByUserId(requestParam: RequestParam) {
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
					}
				}
			}
		};

		return this.ContentService.post(option);
	}

	/**
	 * Function to set result of searchContentByUserId()
	 */
    public setSearchedContent(data: any): void {
        this.searchedContentList = data;
    }

	/**
	 * Function to get searched content list
	 */
    public getSearchedContent(): any {
        return this.searchedContentList;
    }

	/**
	 * Function to get organisation details. 
	 * It takes orgId(s) as param and trigger content service to get organisation(s) details
	 */
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

		return this.ContentService.post(option);
	}

	/**
	 * Function Set serched organisation(s) list
	 */
    public setOrganisation(data: any): void {
        this.searchedOrganisationList = data;
    }

	/**
	 * Get searched organisation list
	 */
    public getOrganisation(): any {
        return this.searchedOrganisationList;
    }
}
