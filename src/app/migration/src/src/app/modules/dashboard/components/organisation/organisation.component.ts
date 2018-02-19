import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { UserService } from './../../../../services/user/user.service';
import { RendererService } from './../../services/renderer/renderer.service';
import { SearchService } from './../../../../services/search/search.service';
import { OrganisationService } from './../../services/organisation/organisation.service';
import { DownloadService } from './../../services/download/download.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-organisation',
	templateUrl: './organisation.component.html',
	styleUrls: ['./organisation.component.css']
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
	myOrganisations: Array<any> = [];
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
	downloadComplete: boolean = false;

	/**
   	 * Constructor to create object of injected service(s) and handle routes
	 */
	constructor(
		private DownloadService: DownloadService,
		private Route: Router,
		private ActivatedRoute: ActivatedRoute,
		private UserService: UserService,
		private SearchService: SearchService,
		private RendererService: RendererService,
		private OrgService: OrganisationService) {
		this.ActivatedRoute.params.subscribe(params => {
			// Get already searched org list
			let orgArray = this.SearchService.getOrganisation();
			if (orgArray && orgArray.length) {
				this.myOrganisations = orgArray;
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
	 * Function to get selected org creation / consumption data
   	 * This function internally calls the dashboard service
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

		this.OrgService.getDashboardData(params).subscribe(
			data => {
				this.blockData = data.numericData;
				this.graphData = this.RendererService.visualizer(data, this.chartType);
				this.showDashboard = true;
				this.setError(false)
			},
			err => {
				this.setError(true)
			}
		);
	}

	/**
	 * Function to validate identifier
	 */
	validateIdentifier(identifier: string) {
		if (identifier) {
			let selectedOrg = _.find(this.myOrganisations, ['identifier', identifier]);
			if (selectedOrg && selectedOrg.identifier) {
				this.SelectedOrg = selectedOrg.orgName;
			} else {
				// TODO: Need to redirect to home page
				this.Route.navigate(['migration/groups'])
			}
		}
	}

	/**
	* Function to change filter and get selected filter data
	*/
	onAfterFilterChange(timePeriod: string) {
		if (this.timePeriod === timePeriod) return false
		this.Route.navigate(['migration/dashboard/organisation', this.datasetType, this.identifier, timePeriod])
	}

	/**
	 * Function to change dataset. Dataset is required to contruct dashboard api url
	 */
	onAfterDatasetChange(datasetType: string) {
		if (this.datasetType === datasetType) return false
		this.Route.navigate(['migration/dashboard/organisation', datasetType, this.identifier, this.timePeriod])
	}

	/**
	 * Graph navigation. TODO - add more desc
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	/**
	 * Function to get selected organisation id 
	 */
	onAfterOrgChange(identifier, orgName) {
		if (this.identifier === identifier) return false
		this.Route.navigate(['migration/dashboard/organisation', this.datasetType, identifier, this.timePeriod])
	}

	/**
	 * Function to get logged user organisationIds
	 */
	getMyOrganisations() {
		let orgIds = []
		// Get logged in user organisation id's
		this.UserService.userData$.subscribe(
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
	 * Function to get organisation(s) details. 
	 * This function internally calls the search service
	 */
	getOrgDetails(orgIds: Array<any>) {
		// Check orgids
		if (orgIds && orgIds.length) {
			this.SearchService.getOrganisationDetails({ orgid: orgIds }).subscribe(
				data => {
					this.myOrganisations = data.result.response.content;
					this.SearchService.setOrganisation(this.myOrganisations);
					this.isMultipleOrgs = orgIds.length > 1 ? true : false;

					if (this.identifier) {
						this.isMultipleOrgs = false;
						this.validateIdentifier(this.identifier)
					}

					if (this.myOrganisations.length === 1) {
						this.identifier = this.myOrganisations[0].identifier;
						this.Route.navigate(['migration/dashboard/organisation', this.datasetType, this.identifier, this.timePeriod])
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
	 * Function to set error flag
	 */
	setError(flag: boolean) {
		this.showError = flag;
		this.showLoader = false;
	}
	ngOnInit() {
	}

	downloadReport() {
		this.disabledClass = true;
		const option = {
			data: { identifier: this.identifier, timePeriod: this.timePeriod },
			dataset: this.datasetType === 'creation' ? 'ORG_CREATION' : 'ORG_CONSUMPTION'
		}

		this.DownloadService.downloadReport(option).subscribe(
			data => {
				this.downloadComplete = true;
				this.disabledClass = false;
			},
			err => {
				this.disabledClass = false;
			}
		);
	}

	alert(): void {
		console.log('Your message here');
	}
}
