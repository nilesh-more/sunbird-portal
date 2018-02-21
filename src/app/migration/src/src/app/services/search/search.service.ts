import { Injectable, Input } from '@angular/core';
import { UserService } from './../user/user.service';
import { ContentService } from './../content/content.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import * as  urlConfig from '../../config/url.config.json';
const urlsConfig = (<any>urlConfig);

/**
 * Interface
 */
interface RequestParam {
	status?: any;
	contentType?: any;
	params?: any;
	orgid?: any;
}

/**
 * Service to search content 
 */
@Injectable()

/**
 * @class SearchService
 */
export class SearchService {
	/**
	 * Contains searched content list 
	 */
	searchedContentList: any;

	/**
	 * Contains searched organization list
	 */
	searchedOrganisationList: any;

	/**
	 * Default method of OrganisationService class
	 * 
	 * @param UserService 
	 * @param ContentService 
	 */
	constructor(private UserService: UserService, private ContentService: ContentService) { }

	/**
	 * Search content by user id.
	 * 
	 * @param {requestParam} requestParam api request data
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
	 * Set result of searchContentByUserId()
	 * 
	 * @param {any} data api response
	 */
    public setSearchedContent(data: any): void {
        this.searchedContentList = data;
    }

	/**
	 * Get searched content list
	 */
    public getSearchedContent(): any {
        return this.searchedContentList;
    }

	/**
	 * Get organization details.
	 * 
	 * @param {requestParam} requestParam api request data
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
	 * Set serched organization(s) list
	 * 
	 * @param {data} data api response
	 */
    public setOrganisation(data: any): void {
        this.searchedOrganisationList = data;
    }

	/**
	 * Get searched organization list
	 */
    public getOrganisation(): any {
        return this.searchedOrganisationList;
    }
}
