import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'
import { SearchService } from '../../services/search.service'
import { CourseConsumptionService } from '../../dashboard/datasource/course-consumption.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';


@Component({
  selector: 'course-consumption-dashboard',
  templateUrl: './course-consumption.component.html',
  styleUrls: ['./course-consumption.component.css']
})

export class CourseConsumptionDashboardComponent implements OnInit {
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
  constructor(private CourseConsumptionService: CourseConsumptionService, 
      private DashboardUtils: DashboardUtilsService, private SearchService: SearchService) {
    this.blockData = []
    this.myCoursesList = []
    this.getMyContent()
    this.getData()
  }

  getData(){
    var req = {identifier: 'do_2123250076616048641482', timePeriod: '5w'}
    this.CourseConsumptionService.getData({
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
        this.graphData = this.parseApiResponse(err.bucketData)
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
    _.forEach(res, (bucketData, key) => {
      let groupData: object = {}
      let yAxesLabel: string = res.name
      groupData['legend'] = [bucketData.name]

      if (bucketData.time_unit !== undefined) {
        yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
      } else {
        yAxesLabel = bucketData.name
      }

      var chartData = this.DashboardUtils.getLineDataA(bucketData)

      // Options
      groupData['options'] = this.DashboardUtils.getChartOption(yAxesLabel)
      groupData['yAxes'] = [{data: chartData.values, label: yAxesLabel}]
      groupData['xAxes'] = chartData.labels

      if (groupList[bucketData.group_id]) {
        Array.prototype.push.apply(groupList[bucketData.group_id].yaxes, groupData['yaxes'])
      } else {
        groupList[bucketData.group_id] = groupData
      }
      // Colors
      groupData['colors'] = this.DashboardUtils.getChartColors(groupList[bucketData.group_id].legend.length)

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
