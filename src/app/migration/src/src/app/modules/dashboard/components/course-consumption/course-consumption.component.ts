import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { SearchService } from './../../../../services/search/search.service';
import { RendererService } from './../../services/renderer/renderer.service';
import { DashboardService } from './../../services/dashboard.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-course-consumption',
	templateUrl: './course-consumption.component.html',
	styleUrls: ['./course-consumption.component.css']
})

/**
 * Dashboard data
 */
export class CourseConsumptionComponent implements OnInit {
	// Variable(s) to make api request
	timePeriod: string = '7d';
	identifier: string = '';
	courseName: string = '';
	myCoursesList: Array<any> = [];
	selectedCourse:any;
	// Variables to render chart and block data
	graphData: any;
	blockData: Array<any> = [];
	showGraph: number = 0;
	// Flags to show loader and error
	showLoader: boolean = true;
	showError: boolean = false;
	isMultipleCourses: boolean = false;
	invalidUrl: boolean = false;
	// Graph settings - chartType = line/bar/radar/pie etc 
	chartLegend: boolean = true;
	chartType: string = 'line';
	showDashboard: boolean = false;

	/**
	 * Constructor to create injected service(s) object
	 */
	constructor(private Route: Router,
		private ActivatedRoute: ActivatedRoute,
		private SearchService: SearchService,
		private RendererService: RendererService,
		private DashboardService: DashboardService) {
			this.ActivatedRoute.params.subscribe(params => {
				// Get content
				let myCourses = this.SearchService.getContent()
				if (myCourses && myCourses.length){
					this.myCoursesList = myCourses
					this.validateIdentifier(params.id)
				} else {
					// Make api call to search my course
					this.getMyContent()
				}

				if (params.id && params.timePeriod) {
					this.isMultipleCourses = false
					this.showDashboard = true;
					this.getDashboardData(params.timePeriod, params.id);
				}
			}
		);
	}

	/**
     * Function to make api call to get course consumption dashboard data 
	 */
	getDashboardData(timePeriod: string, identifier: string) {
		this.showLoader = true
		this.timePeriod = timePeriod ? timePeriod : '7d'
		this.identifier = identifier
		const params = {
			data: {
				identifier: this.identifier,
				timePeriod: this.timePeriod
			}
		}
		this.DashboardService.getCourseConsumptionData(params)
			.subscribe(data => {
				this.blockData = data.numericData;
				this.graphData = this.RendererService.visualizer(data, this.chartType)
				this.showLoader = false;
			},
			err => {
				this.showLoader = false;
				this.showError = true;
			}
		);
	}

	/**
	 * Function to validate url identifier
	 */
	validateIdentifier(identifier: string) {
		if (identifier){
			let selectedCourse = _.find(this.myCoursesList, ['identifier', identifier]);
			if (selectedCourse.identifier){
				this.courseName = selectedCourse.name;
				this.selectedCourse = selectedCourse;
			} else {
				this.invalidUrl = true;
			}
		}
	}

	/**
     * Function to get list of courses created by logged in user. 
	 * This function internally call's the search service
	 */
	getMyContent() {
		const searchParams = {
			status: ['Live', 'Draft'], contentType: ['Course', 'Textbook'], 
			params: { lastUpdatedOn: 'desc' }
		}
		this.SearchService.searchContentByUserId(searchParams).subscribe(
			data => {
				if (data.result.count && data.result.content) {
					this.myCoursesList = data.result.content;
					this.SearchService.setContent(this.myCoursesList)
					if (this.identifier){
						this.validateIdentifier(this.identifier)
					}

					if (data.result.content.length === 1) {
						this.identifier = data.result.content[0].identifier;
						this.courseName = data.result.content[0].name;
						this.Route.navigate(['migration/dashboard/course/consumption', this.identifier, this.timePeriod])
					} else {
						this.isMultipleCourses = true;
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
	 * Function to get selected course data
	 */
	onAfterCourseChange(course: any) {
		if (this.identifier === course.identifier) return false
		this.Route.navigate(['migration/dashboard/course/consumption', course.identifier, this.timePeriod])
	}

	/**
	 * Function to get selected filter data
	 */
	onAfterFilterChange(timePeriod: string) {
		if (this.timePeriod === timePeriod) return false
		this.Route.navigate(['migration/dashboard/course/consumption', this.identifier, timePeriod])
	}

	/**
	 * Function to navigate between two graphs
	 */
	graphNavigation(step: string) {
		step === 'next' ? this.showGraph++ : this.showGraph--
	}

	ngOnInit() {
	}
}
