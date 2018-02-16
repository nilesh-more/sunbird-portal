import { Injectable } from '@angular/core';
import { LineChartService } from './graphs/line-chart.service';
import * as _ from 'lodash';

@Injectable()
/**
 * RendererService to display graph 
 */
export class RendererService {

    /**
     * Constructor to create injected service(s) object
     */
    constructor(private LineChartService: LineChartService) { }

    /**
     * Mapper function to call graph type services - lineChartService/barChartService.
     * Currently it supports only lineChart
     */
    visualizer(data, chartType: string) {
        switch (chartType) {
            case 'line':
                return this.LineChartService.parseLineChart(data)
        }
    }
}
