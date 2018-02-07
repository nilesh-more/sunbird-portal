import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { CourseConsumptionService } from '../../dashboard/datasource/course-consumption.service';
import { RendererService } from '../../dashboard/renderer/renderer.service';
import * as _ from 'lodash';

/**
 * The course creation dashboard component
 */
@Component({
	selector: 'course-consumption-dashboard',
	templateUrl: './course-consumption.component.html',
	styleUrls: ['./course-consumption.component.css']
})

/**
 * @class CourseConsumptionDashboardComponent
 * @desc interact with dashboard data sources and renderer 
 */
export class CourseConsumptionDashboardComponent implements OnInit {
	// Variable(s) to make api request
	timePeriod: string = '7d'
	identifier: string = ''
	courseName: string = ''
	myCoursesList: Array<any> = []
	// Variables to render chart and block data
	graphData: any
	blockData: Array<any> = []
	showGraph: number = 0;
	// Flags to show loader and error
	showLoader: boolean = true
	showError: boolean = false
	isMultipleCourses: boolean = false
	// Graph settings - chartType = line/bar/radar/pie etc 
	chartLegend: boolean = true; 
	chartType: string = 'line';

	/**
	 * @function constructor
	 * @desc create injected service(s) object
	 * @param {object} CourseConsumptionService
	 * @param {object} SearchService
	 */
	constructor(private CourseConsumptionService: CourseConsumptionService, 
		private SearchService: SearchService, 
		private RendererService: RendererService) {
		this.blockData = []
		this.myCoursesList = []
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
				this.blockData = data.numericData
				this.graphData = this.RendererService.visualizer(data, this.chartType)
				this.showLoader = false
			},
			err => {
				this.showLoader = false
				this.showError = true
			}
			);
	}

	/**
	 * @function getMyContent
	 * @desc get courses created by me
	 */
	getMyContent() {
		this.SearchService.getMyContent(['Live', 'Draft'], ['Course', 'Textbook'], { lastUpdatedOn: 'desc' }).subscribe(
			data => {
				if (data.result.count && data.result.content) {
					this.myCoursesList = data.result.content
					if (data.result.content.length === 1) {
						this.identifier = data.result.content[0].identifier
						this.courseName = data.result.content[0].name
						this.getData('7d', data.result.content[0].identifier)
					} else {
						this.isMultipleCourses = true
					}
				}

				this.showLoader = false
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
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	/**
	 * @function ngOnInit
	 * @desc get list of 'Live' course(s) created by me
	 */
	ngOnInit() {
		this.getMyContent()
	}
}
