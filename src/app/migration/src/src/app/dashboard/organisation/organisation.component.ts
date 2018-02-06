import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service'
import { OrganisationService } from '../../dashboard/datasource/organisation.service';
import { DownloadService } from '../../dashboard/datasource/download.service';
import { RendererService } from '../../dashboard/renderer/renderer.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-organisation',
	templateUrl: './organisation.component.html',
	styleUrls: ['./organisation.component.css']
})

export class OrganisationComponent {
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
	disabledClass: boolean = false

	/**
	 * @function constructor
	 * @desc to initialize variables
	 */
	constructor(private OrganisationService: OrganisationService,
		private SearchService: SearchService,
		private DownloadService: DownloadService,
		private RendererService: RendererService) {
		this.blockData = []
		this.datasetType = 'ORG_CREATION'
		this.showData()
	}

	/**
	 * @function getData
	 * @desc change filter
	 * @param {string} timePeriod
	 * @param {string} identifier
	 * @return void
	 */
	getData(timePeriod: string, identifier: string) {
		this.showDataDiv = false
		this.showLoader = true
		this.showGraph = 0
		this.timePeriod = timePeriod
		this.identifier = identifier
		this.OrganisationService.getData({
			identifier: this.identifier,
			timePeriod: this.timePeriod
		}, this.datasetType).subscribe(
			data => {
				this.blockData = data.numericData
				this.graphData = this.RendererService.visualizer(data, this.lineChartType)
				this.showLoader = false
				this.showDataDiv = true
			},
			err => {
				this.showLoader = false
			}
			);
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
		this.datasetType = datasetType
		this.getData('7d', this.identifier)
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

	/**
	 * @method onAfterOrgChange
	 * @desc On changing organisation dropdown calling getData
	 * @param {string}  orgId Organisation Id
	 * @param {string}  orgName Organisation Name
	 */
	onAfterOrgChange(orgId, orgName) {
		this.SelectedOrg = orgName
		this.identifier = orgId
		this.getData(this.timePeriod, this.identifier)
	}

	/**
	 * @function showData
	 * @desc Show data
	 */
	showData() {
		var orgIds = ["01229679766115942443", "0123150108807004166", "01230801634741452824", "01230654824904294426", "0123131115383275520", "ORG_001"]
		//var orgIds = ["ORG_001"]

		this.SearchService.orgSearch({ 'request': { 'filters': { id: orgIds } } }).subscribe(
			data => {
				_.forEach(data.result.response.content, (org) => {
					this.orgArray.push({ organisationId: org.id, orgName: org.orgName })
				})
			},
			err => {
			}
		);

		if (orgIds.length === 1) {
			this.identifier = orgIds[0]
			this.getData(this.timePeriod, this.identifier)
		} else {
			this.showOrgWarningDiv = true
		}
	}

	/**
	 * @method downloadReport
	 * @desc Download report
	 */
	downloadReport() {
		this.disabledClass = true
		this.DownloadService.getDownloadData({
			identifier: this.identifier,
			timePeriod: this.timePeriod
		}, this.datasetType).subscribe(
			data => {
				console.log('download data = ', data)
			},
			err => {
				this.disabledClass = false
			}
			);
	}
}

