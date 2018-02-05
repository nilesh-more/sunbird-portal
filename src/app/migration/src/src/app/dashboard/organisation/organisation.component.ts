import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'
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
	public blockData: Array<any> = []
	public timePeriod: string = '7d'
	public identifier: string = ''
	public showLoader: boolean = true
	public showGraph: number = 0;
	public showError: boolean = false
	public graphData: any
	public datasetType: any = 'ORG_CREATION'  
  
  /**
   * @function constructor
   * @desc to initialize variables
   */
  constructor(private OrganisationService: OrganisationService, 
      private DashboardUtils: DashboardUtilsService, private SearchService: SearchService, 
      private RendererService: RendererService) {

      this.blockData = []
      this.datasetType = 'ORG_CREATION'
      this.getData(this.timePeriod, 'ORG_001')
  }

  getData(timePeriod: string, identifier: string){
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

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
}

