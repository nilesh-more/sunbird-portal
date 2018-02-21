import { Injectable } from '@angular/core';
import { LineChartService } from './graphs/line-chart.service';
import * as _ from 'lodash';

/**
 * Responsible to get chart data
 */
@Injectable()

/**
 * @class RendererService
 */
export class RendererService {

    /**
	 * Default method of OrganisationService class
     * 
     * @param LineChartService 
     */
    constructor(private LineChartService: LineChartService) { }

    /**
     * Mapper to call line chart service
     * 
     * Currently, it supports only line chart 
     * 
     * @param {any}    data      data
     * @param {string} chartType linechart
     * 
     * @return {object} line chart data
     */
    visualizer(data: any, chartType: string) {
        switch (chartType) {
            case 'line':
                return this.LineChartService.parseLineChart(data)
        }
    }
}
