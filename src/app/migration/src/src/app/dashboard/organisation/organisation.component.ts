import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'
import { SearchService } from '../../services/search.service'
import { OrganisationService } from '../../dashboard/datasource/organisation.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})



export class OrganisationComponent implements OnInit {
  myCoursesList: Array<any> = []
  public blockData: Array<any> = []
  public graphData: any
  public timePeriod: string = '7d'
  public identifier: string
  public courseName: string
  public showLoader: boolean = true

  
  /**
   * @function constructor
   * @desc to initialize variables
   */
  constructor(private OrganisationService: OrganisationService, 
      private DashboardUtils: DashboardUtilsService, private SearchService: SearchService) {
    this.blockData = []
    this.myCoursesList = []
    this.getMyContent()
    this.getData()
  }

  getData(){
    this.OrganisationService.getData({
      identifier: this.identifier,
      timePeriod: this.timePeriod
    }).subscribe(
      data => {
          console.log('API-Response: : Dashboard compo', data)
          this.blockData = data.numericData
          this.graphData = this.parseApiResponse(data.bucketData)
      },
      err => {
        this.blockData = err.numericData
        this.graphData = this.parseApiResponse(err)
      }
    );
  }

  getMyContent(){
    this.SearchService.getMyContent(['Live'], ['Course'], {lastUpdatedOn: 'desc'}).subscribe(
        data => {
            this.myCoursesList = data.result.content
            // Check course count
            if (this.myCoursesList && this.myCoursesList.length === 1) {
              this.identifier = data.result.content[0].identifier
              this.courseName = data.result.content[0].name
            } else {
              console.log('more than one course')
            }
            this.showLoader = false
            console.log('API-Response: Dashboard search ', data)
        },
        err => {
          this.myCoursesList = err.result.content
          if(this.myCoursesList.length === 1){
            this.identifier = err.result.content[0].identifier
            this.courseName = err.result.content[0].name
          } else {
            console.log('more than one course')
          }
          this.showLoader = false
          console.log('error while fetching my course/content', err)
        }
    );
  }

  onAfterCourseChange(newVal){
    if(this.identifier === newVal.identifier){
      return false
    }
    this.identifier = newVal.identifier
  }

  parseApiResponse(res){
    console.log('Inside rendered---',res);
    var chartList = []
    var groupList = {}
    var i = 0
    _.forEach(res.bucketData, (bucketData, key) => {
      let groupData: object = {}
      let yAxesLabel: string = res.name
    



if (res.series === '') {
              groupData['legend'] = [bucketData.name]

              if (bucketData.time_unit !== undefined) {
                yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
              } else {
                yAxesLabel = bucketData.name
              }
            } else {
              groupData['legend'] = res.series
            }





      var chartData = this.DashboardUtils.getLineData(bucketData)

      
      console.log('Inside rendered1234---',res.series[0]);

      // Options
      groupData['options'] = this.DashboardUtils.getChartOption(yAxesLabel)
      groupData['yAxes'] = [{data: chartData.values, label: res.series[i]}]
      groupData['xAxes'] = chartData.labels


      if (groupList[bucketData.group_id]) {
        Array.prototype.push.apply(groupList[bucketData.group_id].yAxes, groupData['yAxes'])
      } else {
        groupList[bucketData.group_id] = groupData
      }

      // Colors
      groupData['colors'] = this.DashboardUtils.getChartColors(groupList[bucketData.group_id].legend.length)
i++
    });   

   

     

    _.forOwn(groupList, function (group, groupId) {
      chartList.push({yaxesData: group.yAxes, xaxesData: group.xAxes, chartOptions: group.options, chartColors: group.colors  })
    })

   

    return chartList  
  }

  ngOnInit() {
  }

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
}

