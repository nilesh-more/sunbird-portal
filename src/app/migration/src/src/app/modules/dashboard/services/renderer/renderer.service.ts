import { Injectable } from '@angular/core';
import { LineChartService } from './graphs/line-chart.service';
import * as _ from 'lodash';

@Injectable()
export class RendererService {

  constructor(private LineChartService: LineChartService) { }

  visualizer(data, chartType: string) {
      switch (chartType) {
          case 'line':
              return this.LineChartService.parseLineChart(data)
      }
  }
}
