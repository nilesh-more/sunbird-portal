import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { UserService } from './../../../../services/user/user.service';
import { RendererService } from './../../services/renderer/renderer.service';
import { SearchService } from './../../../../services/search/search.service';
import { OrganisationService } from './../../services/organization/organization.service';
import { DownloadService } from './../../services/download/download.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-organization',
	templateUrl: './organization.component.html',
	styleUrls: ['./organization.component.css']
})

/**
 * Component to display Organisation creation, consumption dashboard
 */
export class OrganisationComponent implements OnInit {
	// Variable(s) to make api request
	timePeriod: string = '7d';
	identifier: string = '';
	datasetType: string = 'creation';
	// Variables to render chart and block data
	graphData: any;
	blockData: Array<any> = [];
	showGraph: number = 0;
	myOrganizations: Array<any> = [];
	SelectedOrg: string;
	// Graph settings - chartType = line/bar/radar/pie etc 
	lineChartLegend: boolean = true;
	chartType: string = 'line';
	// Flags to show loader/error/canvas
	showLoader: boolean = true;
	showError: boolean = false;
	showDashboard: boolean = false;
	// Variables to control view
	isMultipleOrgs: boolean = false;
	disabledClass: boolean = false;
	showDownloadModal: boolean = false;

	/**
   	 * Constructor to create object of injected service(s) and handle routes
	 */
	constructor(
		private downloadService: DownloadService,
		private route: Router,
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private searchService: SearchService,
		private rendererService: RendererService,
		private orgService: OrganisationService,
		public resourceService: ResourceService) {
		this.activatedRoute.params.subscribe(params => {
			console.log(this.resourceService)
			// Get already searched org list
			let orgArray = this.searchService.getOrganisation();
			if (orgArray && orgArray.length) {
				this.myOrganizations = orgArray;
				this.validateIdentifier(params.id)
			} else {
				// If org list not found then make api call
				this.getMyOrganisations();
			}

			if (params.id && params.timePeriod) {
				this.datasetType = params.datasetType;
				this.showDashboard = false;
				this.getDashboardData(params.timePeriod, params.id);
			}
		}
		);
	}

	/**
	 * Function to get dashboard data for given time period and organization identifier
	 */
	getDashboardData(timePeriod: string, identifier: string) {
		this.showLoader = true;
		this.isMultipleOrgs = false;
		this.timePeriod = timePeriod;
		this.identifier = identifier;

		const params = {
			data: {
				identifier: this.identifier,
				timePeriod: this.timePeriod
			},
			dataset: this.datasetType === 'creation' ? 'ORG_CREATION' : 'ORG_CONSUMPTION'
		}

		this.orgService.getDashboardData(params).subscribe(
			data => {
				this.blockData = data.numericData;
				this.graphData = this.rendererService.visualizer(data, this.chartType);
				this.showDashboard = true;
				this.setError(false)
			},
			err => {
				this.setError(true)
			}
		);
	}

	/**
	 * This function is used to validate given organization identifier.
	 * User gets redirect to home page if url contains invalid url or valid identifier but logged in user is a not member of given identifier
	 */
	validateIdentifier(identifier: string) {
		if (identifier) {
			let selectedOrg = _.find(this.myOrganizations, ['identifier', identifier]);
			if (selectedOrg && selectedOrg.identifier) {
				this.SelectedOrg = selectedOrg.orgName;
			} else {
				// TODO: Need to redirect to home page
				this.route.navigate(['migration/groups'])
			}
		}
	}

	/**
	 * Function to change time filter and get selected time period data. 
	 * As of now dashboard supports only to show last 7 days, 14 days, and 5 weeks data
	 */
	onAfterFilterChange(timePeriod: string) {
		if (this.timePeriod === timePeriod) return false
		this.route.navigate(['migration/dashboard/organization', this.datasetType, this.identifier, timePeriod])
	}

	/**
	 * Function to switch dashboard type - from creation to consumption and vice versa 
	 */
	onAfterDatasetChange(datasetType: string) {
		if (this.datasetType === datasetType) return false
		this.route.navigate(['migration/dashboard/organization', datasetType, this.identifier, this.timePeriod])
	}

	/**
	 * Function used to switch graph - from Number of user per day to Time spent by day and vice versa
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	/**
	 * Function to change organization
	 */
	onAfterOrgChange(identifier, orgName) {
		if (this.identifier === identifier) return false
		this.route.navigate(['migration/dashboard/organization', this.datasetType, identifier, this.timePeriod])
	}

	/**
	 * Function to set error flag
	 */
	setError(flag: boolean) {
		this.showError = flag;
		this.showLoader = false;
	}

	/**
	 * Function to get logged user organization ids list
	 */
	getMyOrganisations() {
		let orgIds = []
		// Get logged in user organization id's
		this.userService.userData$.subscribe(
			user => {
				if (user && user.userProfile) {
					orgIds = user.userProfile.organisationIds || [];;
					this.getOrgDetails(['01229679766115942443', '0123150108807004166'])
				}
			},
			err => {
				this.setError(true)
			}
		);
	}

	/**
	 * Function to download selected organization report
	 */
	downloadReport() {
		this.disabledClass = true;
		const option = {
			data: { identifier: this.identifier, timePeriod: this.timePeriod },
			dataset: this.datasetType === 'creation' ? 'ORG_CREATION' : 'ORG_CONSUMPTION'
		}

		this.downloadService.downloadReport(option).subscribe(
			data => {
				this.showDownloadModal = true;
				this.disabledClass = false;
			},
			err => {
				this.disabledClass = false;
			}
		);
	}

	/**
	 * Function to get organization details. 
	 * It takes organization id(s) as a parameter and hit composite search api
	 */
	getOrgDetails(orgIds: Array<any>) {
		if (orgIds && orgIds.length) {
			this.searchService.getOrganisationDetails({ orgid: orgIds }).subscribe(
				data => {
					this.myOrganizations = data.result.response.content;
					this.searchService.setOrganisation(this.myOrganizations);
					this.isMultipleOrgs = orgIds.length > 1 ? true : false;

					if (this.identifier) {
						this.isMultipleOrgs = false;
						this.validateIdentifier(this.identifier)
					}

					if (this.myOrganizations.length === 1) {
						this.identifier = this.myOrganizations[0].identifier;
						this.route.navigate(['migration/dashboard/organization', this.datasetType, this.identifier, this.timePeriod])
					}

					this.showLoader = false;
				},
				err => {
					this.setError(true)
				}
			);
		}
	}

	ngOnInit() {
	}
}
