import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LineChartService } from '../../dashboard/renderer/graph/lineChart.service';


@Injectable()
export class RendererService {
    constructor(private LineChartService: LineChartService) { }

    /**
     * @method visualizer
     * @desc - call specific chart file to render graph
     * @param   {object}  data
     * @param   {string}  chartType
     */
    visualizer(data, chartType: string) {
        switch (chartType) {
            case 'line':
                return this.LineChartService.parseLineChart(data)
        }
    }
}
