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

/**
 * The Organization component
 * 
 * Display organization creation, consumption dashboard data
 */
@Component({
	selector: 'app-organization',
	templateUrl: './organization.component.html',
	styleUrls: ['./organization.component.css']
})

/**
 * @class OrganisationComponent
 */
export class OrganisationComponent implements OnInit {
	
	/**
	 * Contains time period - last 7days, 14days, and 5weeks
	 */
	timePeriod: string = '7d';

	/**
	 * Contains selected course identifier
	 * 
	 * Identifier is needed to construct dashboard api url
	 */
	identifier: string = '';

	/**
	 * Dataset type
	 */
	datasetType: string = 'creation';

	/**
	 * Contains course consumption line chart data
	 */
	graphData: any;

	/**
	 * Contains dashboard block data
	 */
	blockData: Array<any> = [];

	/**
	 * Contains Graph index to switch between two graphs
	 */
	showGraph: number = 0;

	/**
	 * Organization list
	 */
	myOrganizations: Array<any> = [];

	/**
	 * Selected organization
	 */
	SelectedOrg: string;

	/**
	 * To display graph legend
	 */
	lineChartLegend: boolean = true;

	/**
	 * Chart type
	 */
	chartType: string = 'line';

	/**
	 * To show / hide loader
	 */
	showLoader: boolean = true;

	/**
	 * To show error
	 */
	showError: boolean = false;

	/**
	 * To show dashboard canvas
	 */
	showDashboard: boolean = false;

	/**
	 * To show / hide organization dropdwon
	 */
	isMultipleOrgs: boolean = false;

	/**
	 * Disabled class
	 */
	disabledClass: boolean = false;

	/**
	 * To show download confirmation modal
	 */
	showDownloadModal: boolean = false;

	/**
	 * Default method of OrganisationService class
	 * 
	 * @param downloadService 
	 * @param route 
	 * @param activatedRoute 
	 * @param userService 
	 * @param searchService 
	 * @param rendererService 
	 * @param orgService 
	 * @param resourceService 
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
	 * 
	 * @param {string} timePeriod timePeriod: last 7d/14d/5w
	 * @param {string} identifier organization unique identifier
	 * 
	 * @example getDashboardData(7d, do_xxxxx)
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
	 * 
	 * User gets redirect to home page if url contains invalid identifier or valid identifier but logged-in user is not a member of given identifier
	 * 
	 * @param {string} identifier organization unique identifier
	 * 
	 * @example validateIdentifier(do_xxxxx)
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
	 * Change time period filter.
	 * 
	 * As of now dashboard supports only to show last 7 days, 14 days, and 5 weeks data.
	 * 
	 * @param {string} timePeriod timePeriod: last 7d / 14d / 5w
	 * 
	 * @example onAfterFilterChange(7d)
	 */
	onAfterFilterChange(timePeriod: string) {
		if (this.timePeriod === timePeriod) return false
		this.route.navigate(['migration/dashboard/organization', this.datasetType, this.identifier, timePeriod])
	}

	/**
	 * To change dashboard type
	 * 
	 * @param {string} datasetType creation and consumption
	 * 
	 * @example onAfterDatasetChange(creation)
	 */
	onAfterDatasetChange(datasetType: string) {
		if (this.datasetType === datasetType) return false
		this.route.navigate(['migration/dashboard/organization', datasetType, this.identifier, this.timePeriod])
	}

	/**
	 * To change graph - from Number of user per day to Time spent by day and vice versa
	 * 
	 * @param {string} step next / previous
	 * 
	 * @example graphNavigation(next)
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	/**
	 * To change organization selection
	 * 
	 * @param {string} identifier organization identifier
	 * @param {string} orgName    organization name
	 * 
	 * @example onAfterOrgChange(identifier: do_xxxxx, Test Organization)
	 */
	onAfterOrgChange(identifier: string, orgName: string) {
		if (this.identifier === identifier) return false
		this.route.navigate(['migration/dashboard/organization', this.datasetType, identifier, this.timePeriod])
	}

	/**
	 * To set error 
	 * 
	 * @param {boolean} flag show error
	 * 
	 * @example setError(true)
	 */
	setError(flag: boolean) {
		this.showError = flag;
		this.showLoader = false;
	}

	/**
	 * Get logged user organization ids list
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
	 * Download dashboard report
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
	 * To get organization details.
	 * 
	 * @param {Array<any>} orgIds orgids list
	 * 
	 * @example getOrgDetails([do_xxxxx])
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

	/**
	 * Angular life cycle hook
	 * 
	 * It indicates that angular is done creating the component
	 */
	ngOnInit() {
	}
}
