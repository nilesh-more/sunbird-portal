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

	public myCoursesList: Array<any> = []
	public blockData: Array<any> = []
	public timePeriod: string = '7d'
	public identifier: string = ''
	public courseName: string = ''
	public showLoader: boolean = true
	public isMultipleCourses: boolean = false
	public showGraph: number = 0;
	public showError: boolean = false
	public graphData: any


	/**
	 * @function constructor
	 * @desc to initialize variables
	 * @param {object} CourseConsumptionService
	 * @param {object} DashboardUtilsService
	 * @param {object} SearchService
	 * @return void
	 */
	constructor(private CourseConsumptionService: CourseConsumptionService,
		private DashboardUtils: DashboardUtilsService, private SearchService: SearchService) {
		this.blockData = []
		this.myCoursesList = []
		this.getMyContent()
	}

	/**
	 * @function getData
	 * @desc get dashboard data
	 * @param {string} timePeriod 
	 * @param {string} identifier 
	 */
	getData(timePeriod: string, identifier: string) {
		this.showLoader = true
		this.timePeriod = timePeriod ? timePeriod : '7d'
		this.identifier = identifier
		this.CourseConsumptionService.getData({
			identifier: this.identifier,
			timePeriod: this.timePeriod
		}).subscribe(
			data => {
				console.log('API-Response: Dashboard -', data)
				this.blockData = data.numericData
				this.graphData = this.parseApiResponse(data.bucketData)
			},
			err => {
				this.showError = true
			}
			);
		this.showLoader = false
	}

	/**
	 * @function getMyContent
	 * @desc get courses created by me
	 * @return void
	 */
	getMyContent() {
		this.SearchService.getMyContent(['Live'], ['Course'], { lastUpdatedOn: 'desc' }).subscribe(
			data => {
				if (data.result.count && data.result.content) {
					this.myCoursesList = data.result.content
					if (data.result.content.length === 1) {
						this.identifier = data.result.content[0].identifier
						this.courseName = data.result.content[0].name
						this.getData('7d', data.result.content[0].identifier)
					} else {
						console.log('more than one course')
						this.isMultipleCourses = true
					}
				}

				this.showLoader = false
				console.log('API-Response: Dashboard search ', data)
			},
			err => {
				this.showError = true
			}
		);
	}

	/**
	 * @function onAfterCourseChange
	 * @desc change course
	 * @param {object} course
	 * @return void 
	 */
	onAfterCourseChange(course) {
		if (this.identifier === course.identifier) {
			return false
		}
		this.isMultipleCourses = false
		this.getData(this.timePeriod, course.identifier)
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
	 * @function graphNavigation
	 * @desc show 
	 * @param {string} step 
	 * @return void
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	/**
	 * @function parseApiResponse
	 * @desc prepare line chart data
	 * @param {object} data
	 * @return {object} lineChartData
	 */
	parseApiResponse(data) {
		console.log('Line chart rendered called: ', true);
		var lineChartData = []
		var groupList = {}
		_.forEach(data, (bucketData, key) => {
			let groupData: object = {}
			let yAxesLabel: string = data.name
			groupData['legend'] = [bucketData.name]

			if (bucketData.time_unit !== undefined) {
				yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
			} else {
				yAxesLabel = bucketData.name
			}

			var chartData = this.DashboardUtils.getLineData(bucketData)

			// Options
			groupData['options'] = this.DashboardUtils.getChartOption(yAxesLabel)
			groupData['yAxes'] = [{ data: chartData.values, label: yAxesLabel }]
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
			lineChartData.push({ yaxesData: group.yAxes, xaxesData: group.xAxes, chartOptions: group.options, chartColors: group.colors })
		})

		console.log('Line chart data prepared: ', lineChartData);
		return lineChartData
	}

	ngOnInit() {

	}
}
