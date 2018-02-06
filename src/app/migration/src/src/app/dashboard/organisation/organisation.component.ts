import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service'
import { OrganisationService } from '../../dashboard/datasource/organisation.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import { RendererService } from '../../dashboard/renderer/renderer.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-organisation',
	templateUrl: './organisation.component.html',
	styleUrls: ['./organisation.component.css']
})

export class OrganisationComponent implements OnInit {
	blockData: Array<any> = []
	orgArray: Array<any> = []
	timePeriod: string = '7d'
	identifier: string = ''
	showLoader: boolean = true
	showGraph: number = 0;
	showError: boolean = false
	graphData: any
	datasetType: any = 'ORG_CREATION'
	showOrgWarningDiv: boolean = false
	SelectedOrg: string;
	lineChartLegend: boolean = true
	showDataDiv: boolean = false
	lineChartType: string = 'line'

	/**
	 * @function constructor
	 * @desc to initialize variables
	 */
	constructor(private OrganisationService: OrganisationService,
		private DashboardUtils: DashboardUtilsService, private SearchService: SearchService,
		private RendererService: RendererService) {

		this.blockData = []
		this.datasetType = 'ORG_CREATION'
		//this.getData(this.timePeriod, 'ORG_001')
		this.showData()
	}

	getData(timePeriod: string, identifier: string) {
		this.showLoader = true
		this.showGraph = 0
		this.timePeriod = timePeriod
		this.identifier = identifier
		this.OrganisationService.getData({
			identifier: this.identifier,
			timePeriod: this.timePeriod
		}, this.datasetType).subscribe(
			data => {
				console.log('API-Response: : Dashboard compo', data)
				this.blockData = data.numericData
				this.graphData = this.RendererService.parseApiResponse(data)
				this.showLoader = false
			},
			err => {
				this.blockData = err.numericData
				this.graphData = this.RendererService.parseApiResponse(err)
				this.showLoader = false
			}
			);
		this.showDataDiv = true
		this.showOrgWarningDiv = false
	}

	/**
	 * @function onAfterFilterChange
	 * @desc change filter
	 * @param {string} timePeriod
	 * @return void
	 */
	onAfterFilterChange(timePeriod: string) {
		if (this.timePeriod === timePeriod) {
			return false
		}
		this.getData(timePeriod, this.identifier)
	}

	/**
	 * @function onAfterDatasetChange
	 * @desc change filter
	 * @param {string} timePeriod
	 * @return void
	 */
	onAfterDatasetChange(datasetType: string) {
		if (this.datasetType === datasetType) {
			return false
		}
		this.timePeriod = '7d'
		this.datasetType = datasetType
		this.getData(this.timePeriod, this.identifier)
	}

	/**
	 * @function graphNavigation
	 * @desc show 
	 * @param {string} step 
	 * @return void
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	ngOnInit() {
	}

	/**
 * @method onAfterOrgChange
 * @desc On changing organisation dropdown calling getAdminDashboardData
 * @param {string}  orgId Organisation Id
 */
	onAfterOrgChange(orgId, orgName) {
		this.SelectedOrg = orgName
		this.identifier = orgId
		this.getData(this.timePeriod, this.identifier)
	}



	showData() {
		var orgIds = ["01229679766115942443", "0123150108807004166", "01230801634741452824", "01230654824904294426", "0123131115383275520", "ORG_001"]
		//var orgIds = ["ORG_001"]

		this.SearchService.orgSearch({ 'request': { 'filters': { id: orgIds } } }).subscribe(
			data => {
				console.log('API-Response: : org success compo', data)
				_.forEach(data.result.response.content, (org) => {
					this.orgArray.push({ organisationId: org.id, orgName: org.orgName })
				})
			},
			err => {
				console.log('API-Response: : org error compo', err)
				var res = { "id": "api.org.search", "ver": "v1", "ts": "2018-02-05 10:56:31:809+0000", "params": { "resmsgid": null, "msgid": "97cc5609-6ec7-4b29-aae2-05a4d3026e0e", "err": null, "status": "success", "errmsg": null }, "responseCode": "OK", "result": { "response": { "count": 6, "content": [{ "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": null, "description": "ABC Corporation", "updatedDate": "2017-09-04 10:44:30:921+0000", "addressId": "01230654297501696027", "orgType": "Training", "provider": null, "orgCode": "ABCL", "theme": null, "id": "01230654824904294426", "communityId": null, "isApproved": null, "slug": null, "identifier": "01230654824904294426", "thumbnail": null, "orgName": "ABC Corporation", "updatedBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "address": { "country": "India", "updatedBy": null, "city": "Chennai", "updatedDate": null, "userId": null, "zipcode": "45678", "addType": null, "createdDate": "2017-08-09 07:20:29:343+0000", "isDeleted": null, "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "addressLine1": null, "addressLine2": null, "id": "01230654297501696027", "state": "TN" }, "externalId": null, "isRootOrg": false, "rootOrgId": "ORG_001", "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": null, "createdDate": "2017-08-09 07:20:29:342+0000", "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "parentOrgId": null, "hashTagId": "01230654824904294426", "noOfMembers": 1, "status": null }, { "dateTime": null, "preferredLanguage": null, "approvedBy": null, "channel": null, "description": null, "updatedDate": "2017-08-16 09:24:55:671+0000", "addressId": null, "orgType": null, "provider": null, "orgCode": null, "theme": null, "id": "01229679766115942443", "communityId": null, "isApproved": null, "slug": null, "identifier": "01229679766115942443", "thumbnail": null, "orgName": "XYZ Institution", "updatedBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "externalId": null, "isRootOrg": null, "rootOrgId": null, "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": null, "createdDate": null, "createdBy": null, "parentOrgId": null, "hashTagId": null, "noOfMembers": 1, "status": null }, { "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": null, "description": "EKSTEP Corporation", "updatedDate": null, "addressId": "0123131141138350081", "orgType": "Training", "provider": null, "orgCode": "ABCL", "theme": null, "id": "0123131115383275520", "communityId": null, "isApproved": null, "slug": null, "identifier": "0123131115383275520", "thumbnail": null, "orgName": "EKSTEP Corporation", "updatedBy": null, "address": { "country": "India", "updatedBy": null, "city": "Chennai", "updatedDate": null, "userId": null, "zipcode": "45678", "addType": null, "createdDate": "2017-08-18 13:59:28:684+0000", "isDeleted": null, "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "addressLine1": null, "addressLine2": null, "id": "0123131141138350081", "state": "TN" }, "externalId": null, "isRootOrg": true, "rootOrgId": "ORG_001", "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": "[{\"email\":\"test@test.com\",\"phone\":\"213124234234\"},{\"email\":\"test1@test.com\",\"phone\":\"+91213124234234\"}]", "createdDate": "2017-08-18 13:59:28:684+0000", "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "parentOrgId": null, "hashTagId": "0123131115383275520", "noOfMembers": 1, "status": null }, { "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": "ROOT_ORG", "description": "Sunbird", "updatedDate": "2017-08-24 06:02:10:846+0000", "addressId": null, "orgType": null, "provider": null, "orgCode": "sunbird", "theme": null, "id": "ORG_001", "communityId": null, "isApproved": null, "slug": "sunbird", "identifier": "ORG_001", "thumbnail": null, "orgName": "Sunbird", "updatedBy": "user1", "externalId": null, "isRootOrg": true, "rootOrgId": null, "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": "[{\"phone\":\"213124234234\",\"email\":\"test@test.com\"},{\"phone\":\"+91213124234234\",\"email\":\"test1@test.com\"}]", "createdDate": null, "createdBy": null, "parentOrgId": null, "hashTagId": "b00bc992ef25f1a9a8d63291e20efc8d", "noOfMembers": 1, "status": null }, { "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": null, "description": "ABC Corporation", "updatedDate": null, "addressId": "01230801379060121625", "orgType": "Training", "provider": null, "orgCode": "ABCL", "theme": null, "id": "01230801634741452824", "communityId": null, "isApproved": null, "slug": null, "identifier": "01230801634741452824", "thumbnail": null, "orgName": "ABC Corporation", "updatedBy": null, "address": { "country": "India", "updatedBy": null, "city": "Chennai", "updatedDate": null, "userId": null, "zipcode": "45678", "addType": null, "createdDate": "2017-08-11 09:10:12:356+0000", "isDeleted": null, "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "addressLine1": null, "addressLine2": null, "id": "01230801379060121625", "state": "TN" }, "externalId": null, "isRootOrg": false, "rootOrgId": "ORG_001", "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": null, "createdDate": "2017-08-11 09:10:12:356+0000", "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "parentOrgId": null, "hashTagId": null, "noOfMembers": 1, "status": null }, { "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": null, "description": "NTP Content Create Testing", "updatedDate": null, "addressId": "0123150128754360327", "orgType": "Training", "provider": null, "orgCode": "NCCT", "theme": null, "id": "0123150108807004166", "communityId": null, "isApproved": null, "slug": null, "identifier": "0123150108807004166", "thumbnail": null, "orgName": "NTP Content Create Testing", "updatedBy": null, "address": { "country": "India", "updatedBy": null, "city": "Chennai", "updatedDate": null, "userId": null, "zipcode": "45678", "addType": null, "createdDate": "2017-08-21 06:26:13:394+0000", "isDeleted": null, "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "addressLine1": null, "addressLine2": null, "id": "0123150128754360327", "state": "TN" }, "externalId": null, "isRootOrg": false, "rootOrgId": "ORG_001", "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": null, "createdDate": "2017-08-21 06:26:13:393+0000", "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "parentOrgId": null, "hashTagId": "0123150108807004166", "noOfMembers": 1, "status": null }] } } }
				//var res = { "id": "api.org.search", "ver": "v1", "ts": "2018-02-05 10:56:31:809+0000", "params": { "resmsgid": null, "msgid": "97cc5609-6ec7-4b29-aae2-05a4d3026e0e", "err": null, "status": "success", "errmsg": null }, "responseCode": "OK", "result": { "response": { "count": 6, "content": [{ "dateTime": null, "preferredLanguage": "English", "approvedBy": null, "channel": null, "description": "ABC Corporation", "updatedDate": "2017-09-04 10:44:30:921+0000", "addressId": "01230654297501696027", "orgType": "Training", "provider": null, "orgCode": "ABCL", "theme": null, "id": "01230654824904294426", "communityId": null, "isApproved": null, "slug": null, "identifier": "01230654824904294426", "thumbnail": null, "orgName": "ABC Corporation", "updatedBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "address": { "country": "India", "updatedBy": null, "city": "Chennai", "updatedDate": null, "userId": null, "zipcode": "45678", "addType": null, "createdDate": "2017-08-09 07:20:29:343+0000", "isDeleted": null, "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "addressLine1": null, "addressLine2": null, "id": "01230654297501696027", "state": "TN" }, "externalId": null, "isRootOrg": false, "rootOrgId": "ORG_001", "approvedDate": null, "imgUrl": null, "homeUrl": null, "isDefault": null, "contactDetail": null, "createdDate": "2017-08-09 07:20:29:342+0000", "createdBy": "e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a", "parentOrgId": null, "hashTagId": "01230654824904294426", "noOfMembers": 1, "status": null }] } } }
				_.forEach(res.result.response.content, (org) => {
					this.orgArray.push({ organisationId: org.id, orgName: org.orgName })
				})
				console.log('this.orgArray', this.orgArray)
			}
		);

		if (orgIds.length === 1) {
			this.identifier = orgIds[0]
			this.getData(this.timePeriod, this.identifier)
		} else {
			this.showOrgWarningDiv = true
		}
	}
}

