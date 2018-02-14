import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { UserService } from './../../../../services/user/user.service';
import { RendererService } from './../../services/renderer/renderer.service';
import { DashboardService } from './../../services/dashboard.service';
import { SearchService } from './../../../../services/search/search.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
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

	// Graph settings - chartType = line/bar/radar/pie etc 
	lineChartLegend: boolean = true;
	chartType: string = 'line';

	// Flags to show loader/error/canvas
	showLoader: boolean = true;
	showError: boolean = false;
	showDashboard: boolean = false;
	invalidUrl: boolean = false;

	// Variables to control view
	isMultipleOrgs: boolean = false;
	SelectedOrg: string;
	disabledClass: boolean = false;

	/**
   * Constructor to create object of injected service
	 */
	constructor(
		private Route: Router,
		private ActivatedRoute: ActivatedRoute,
		private UserService: UserService,
		private SearchService: SearchService,
		private RendererService: RendererService,
    	private DashboardService: DashboardService) {
			this.ActivatedRoute.params.subscribe(params => {
				let orgArray = this.SearchService.getOrganisation();
				if (orgArray && orgArray.length) {
						this.myOrganisations = orgArray;
				} else {
					console.log('making search api call');
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

		this.DashboardService.getOrgDashboardData(params).subscribe(
			data => {
				this.blockData = data.numericData;
				this.graphData = this.RendererService.visualizer(data, this.chartType);
				this.showLoader = false;
				this.showDashboard = true;
				this.showError = false;
			},
			err => {
				this.showLoader = false;
				this.showError = true;
			}
		);
	}

  /**
   * Function to get selected course id
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
	 * Function to get logged in organisation list
	 */
	getMyOrganisations() {
		let orgIds = []
		// Get logged in user organisation id's
		this.UserService.userData$.subscribe(
			user => {
				if (user){
					orgIds = user.userProfile.organisationIds || [];
					console.log('orgIdssss', user.userProfile)
          			// orgIds = ['01229679766115942443', '0123150108807004166']
					if (orgIds && orgIds.length){
						// Get org name
						this.SearchService.getOrganisationDetails({ orgid: orgIds }).subscribe(
							data => {
								this.myOrganisations = data.result.response.content;
								this.SearchService.setOrganisation(this.myOrganisations);
								this.isMultipleOrgs = orgIds.length > 1 ? true : false;

								if (this.identifier){
									this.isMultipleOrgs = false;
								}

								if (this.myOrganisations.length === 1) {
									this.identifier = this.myOrganisations[0].identifier;
 									this.Route.navigate(['migration/dashboard/organisation', this.datasetType, this.identifier, this.timePeriod])
								}

								this.showLoader = false;
							},
							err => {
								this.showError = true;
							}
						);
					} else {
            			this.showLoader = false;
          			}
				}
			},
			err =>{
				this.showError = true;
			}
		);
	}

  ngOnInit() {
  }

}
