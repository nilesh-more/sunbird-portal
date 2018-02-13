import { LearnerService } from './../../../services/learner/learner.service';
import { DashboardUtilsService } from './dashboard-utils.service';
import { Injectable } from '@angular/core';
import * as  urlConfig from '../../config/url.config.json';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

interface RequestParam {
	data: object;
	dataset?: string;
}

@Injectable()
export class DashboardService {
	datasetType: {};
	contentStatus: {};

	constructor(private LearnerService: LearnerService,
		private DashboardUtils: DashboardUtilsService) {
			this.contentStatus = {
            	'org.creation.content[@status=published].count': ' LIVE',
            	'org.creation.content[@status=draft].count': ' Created',
            	'org.creation.content[@status=review].count': ' IN REVIEW'
			}
	}


	/**
	 * Function to get course progress data
	 */
	getCourseProgressData(requestParam: RequestParam) {

	}

	/**
	 * Function to get course consumption data
	 */
	getCourseConsumptionData(requestParam: RequestParam) {
		const paramOptions = {
			url: this.DashboardUtils.constructDashboardApiUrl(requestParam.data, 'COURSE_CONSUMPTION')
		};

		return this.LearnerService.get(paramOptions)
			.map((data: any) => {
				let blockData: Array<any> = []
				_.forEach(data.snapshot, (numericData, key) => {
					if (key !== 'course.consumption.users_completed') {
						this.DashboardUtils.secondToMinConversion(numericData)
					}
					blockData.push(numericData)
				})

				return {
					bucketData: data.result.series,
					numericData: blockData,
					series: ''
				}
			})
			.catch((err) => {
				return Observable.throw(err)
			})
	}

	getOrgDashboardData(requestParam: RequestParam){
		const paramOptions = {
			url: this.DashboardUtils.constructDashboardApiUrl(requestParam.data, requestParam.dataset)
		};

        return this.LearnerService.get(paramOptions)
            .map((data: any) => {
                if (data && data.responseCode === 'OK') {
                    return this.parseOrgDashboardData(data.result, requestParam.dataset);
                } else {
                    return Observable.throw(data)
                }
            })
            .catch((err) => {
                return Observable.throw(err)
            })
	}

	parseOrgDashboardData(data: any, dataset: string){
		let graphSeries = [];
		let blockData = [];
		console.log('snap shot', data)

        _.forEach(data.snapshot, (numericData, key) => {
            switch (key) {
            case 'org.creation.authors.count':
            case 'org.creation.reviewers.count':
            case 'org.creation.content.count':
            	blockData.push(numericData)
            	break
			case 'org.consumption.content.time_spent.sum':
          	case 'org.consumption.content.time_spent.average':
            	blockData.push(this.DashboardUtils.secondToMinConversion(numericData))
            	break
            default:
				if (dataset === 'ORG_CREATION') {
					graphSeries.push(numericData.value + this.contentStatus[key])
				} else {
					blockData.push(numericData)
				}
            }
        })

		if (dataset === 'ORG_CREATION') {
			return { bucketData: data.series, numericData: blockData, series: graphSeries,
				name: data.period === '5w' ? 'Content created per week' : 'Content created per day',
			}
		} else {
			return { bucketData: data.series, numericData: blockData, series: '' }
		}

	}
}
