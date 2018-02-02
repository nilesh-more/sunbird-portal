import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'
import { CourseConsumptionService } from '../../dashboard/datasource/course-consumption.service';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';



@Component({
  selector: 'course-consumption-dashboard',
  templateUrl: './course-consumption.component.html',
  styleUrls: ['./course-consumption.component.css']
})

export class CourseConsumptionDashboardComponent implements OnInit {
  courseList: any;
  apiResponse: any;
  chartLabels: Array<any> = [];
  // public numberData:Array<any> = []
  public blockData: Array<any> = []
  public graphData: any

  
  /**
   * @function constructor
   * @desc to initialize variables
   */
  constructor(private CourseConsumptionService: CourseConsumptionService, public DashboardUtils: DashboardUtilsService) {
    // TODO - remove this mock data
    this.blockData = []
    this.courseList = [{'name': 'Course 1'}, {'name': 'Course 2'}]
    this.chartLabels = []
    this.graphData = this.parseApiResponse();
    console.log('dede', this.graphData)
    this.getData()
  }

  print(d) {
	  console.log("block", d)
  }

  getData(){
    var req = {identifier: 'do_2123250076616048641482', timePeriod: '5w'}
    this.CourseConsumptionService.getData(req).subscribe(
        data => {
            alert('success')
            console.log('API-Response', data)
        },
        err => {
          this.blockData = err.numericData
        }
        );
  }

  parseApiResponse(){
    // TODO - remove mock data
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    let res = this.apiResponse.result.series
    console.log('res',res);
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
        chartList.push([group.yAxes, group.xAxes, group.options, group.colors])
        // chartList.push({yaxesData: group.yAxes, xaxesData: group.xAxes, chartOptions: group.options, chartColors: group.colors  })
      })

    return chartList  

  }



  getChartsData(bucketData){
    let values: Array<any> = []
    let labels: Array<any> = []
    _.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
      values.push(bucketValue.value)
      labels.push(bucketValue.key_name)
    })
    return { labels: labels, values: values }
    
  }



 public lineChartData: Array<any> = this.getChartData()

  /**
   * @function getChartData
   * @desc get numeric data
   * @return array
   */
  getChartData (){
    this.getChartLables();
    let chartData: Array<number> = [];
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    _.forEach(this.apiResponse.result.series, function(bucketData, key) {
          let values : Array<string> = []
          let lables : Array<string> = []
          _.forEach(bucketData.buckets, function(data, key) {
            values.push(data.value)
            lables.push(data.key_name)
          });
          let gg:any = {data: values, lables: bucketData.name}
          chartData.push(gg)
    });

    return chartData
  }

  /**
   * @function getChartLables
   * @desc get numeric data
   * @return array
   */

  getChartLables (){
    let chartData: Array<number> = [];
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    _.forEach(this.apiResponse.result.series, function(bucketData, key) {
          let lables : any = []
          chartData.length = 0
          _.forEach(bucketData.buckets, function(data, key) {
            lables.push(data.key_name)
          });
          chartData.push(lables)
    });

    return chartData

  }
  ngOnInit() {

  }


  selectNextAttr(){
    alert('123')
  }

  // public lineChartLabels:Array<any> = this.getChartLables();
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }
}
