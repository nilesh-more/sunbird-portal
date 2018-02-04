import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'


@Injectable()
export class RendererService {
    constructor(private DashboardUtils: DashboardUtilsService) { }

    /**
     * @function getData
     */



    parseApiResponse(res) {
        console.log('Inside rendered---', res);
        var chartList = []
        var groupList = {}
        var i = 0
        _.forEach(res.bucketData, (bucketData, key) => {
            let groupData: object = {}
            let yAxesLabel: string = res.name
            let legendLabel: string = ''

            if (res.series === '') {
                legendLabel = bucketData.name
                groupData['legend'] = [bucketData.name]

                if (bucketData.time_unit !== undefined) {
                    yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
                } else {
                    yAxesLabel = bucketData.name
                }
            } else {
                groupData['legend'] = res.series
                legendLabel = res.series[i]
            }
            var chartData = this.DashboardUtils.getLineData(bucketData)

            // Options
            groupData['options'] = this.DashboardUtils.getChartOption(yAxesLabel)
            groupData['yAxes'] = [{ data: chartData.values, label: legendLabel}]
            groupData['xAxes'] = chartData.labels

            if (groupList[bucketData.group_id]) {
                Array.prototype.push.apply(groupList[bucketData.group_id].yAxes, groupData['yAxes'])
            } else {
                groupList[bucketData.group_id] = groupData
            }

            // Colors
            groupData['colors'] = this.DashboardUtils.getChartColors(groupList[bucketData.group_id].legend.length)
            i++
        });

        _.forOwn(groupList, function (group, groupId) {
            chartList.push({ yaxesData: group.yAxes, xaxesData: group.xAxes, chartOptions: group.options, chartColors: group.colors })
        })

        return chartList
    }




}
