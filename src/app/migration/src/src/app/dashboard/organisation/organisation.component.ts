
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'
import * as _ from 'lodash';
import { CourseConsumptionService } from '../../dashboard/datasource/course-consumption.service';




@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})

export class OrganisationComponent implements OnInit {
  courseList: any;
  apiResponse: any;
  chartLabels: Array<any> = [];
  
  /**
   * @function constructor
   * @desc to initialize variables
   */
  constructor(private CourseConsumptionService: CourseConsumptionService) {
    // TODO - remove this mock data
    CourseConsumptionService.getData({identifier: 'do_2123250076616048641482', timePeriod: '5w'})
    this.courseList = [{'name': 'Course 1'}, {'name': 'Course 2'}]
    this.chartLabels = []
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    this.parseApiResponse()
    // this.DataService.get('123')
  }


  /**
   * @function getNumericData
   * @desc get numeric data
   * @return array
   */
  getNumericData(){
    let num: Array<number> = [];
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    _.forEach(this.apiResponse.result.snapshot, function(value, key) {
        switch (key) {
        case 'org.consumption.content.time_spent.sum':
        case 'org.consumption.content.time_spent.average':
        case 'course.consumption.time_spent.count':
        console.log('num===', num)
        num.push(value)
          break
        default:
          num.push(value)
        }
    });

    return num
  }

  parseApiResponse(){
    // TODO - remove mock data
    this.apiResponse = {"id":"api.sunbird.dashboard.course.consumption","ver":"v1","ts":"2018-01-30 05:41:41:143+0000","params":{"resmsgid":null,"msgid":"a092bb1a-161b-4bef-afde-ef8b70a7302e","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"course":{"courseId":"do_2123497842425282561107"},"period":"7d","snapshot":{"course.consumption.time_spent.count":{"name":"Total time of Content consumption","time_unit":"seconds","value":0},"course.consumption.time_per_user":{"name":"User access course over time","value":0},"course.consumption.users_completed":{"name":"Total users completed the course","value":0},"course.consumption.time_spent_completion_count":{"name":"Average time per user for course completion","value":0,"time_unit":"seconds"}},"series":{"course.consumption.time_spent":{"name":"Timespent for content consumption","split":"content.sum(time_spent)","time_unit":"seconds","group_id":"course.timespent.sum","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]},"course.consumption.content.users.count":{"name":"Number of users by day","split":"content.users.count","group_id":"course.users.count","buckets":[{"key":1516686101135,"key_name":"2018-01-23","value":0},{"key":1516772501135,"key_name":"2018-01-24","value":0},{"key":1516858901135,"key_name":"2018-01-25","value":0},{"key":1516945301135,"key_name":"2018-01-26","value":0},{"key":1517031701135,"key_name":"2018-01-27","value":0},{"key":1517118101135,"key_name":"2018-01-28","value":0},{"key":1517204501135,"key_name":"2018-01-29","value":0}]}}}};
    let res = this.apiResponse.result.series
    _.forEach(res, function(bucketData, key) {
      let groupData: object = {}
      let yAxesLabel: string = res.name
      groupData['legend'] = [bucketData.name]

      if (bucketData.time_unit !== undefined) {
        yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
      } else {
        yAxesLabel = bucketData.name
      }

      console.log('responseAAA ===', groupData)
    });    

  }

  getChartsData(bucketData){
    let values: Array<any> = []
    let lables: Array<any> = []
    
  }

 public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];

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

  // lineChart
  public numberData:Array<any> = this.getNumericData();
  //public lineChartLabels:Array<any> = this.getChartLables();
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

