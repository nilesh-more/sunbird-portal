import { Injectable } from '@angular/core';
import * as _ from 'lodash';

/**
 * Service to prepare line chart data - x, y axes data, lineColor,chartOption data
 */
@Injectable()

/**
 * @class LineChartService
 */
export class LineChartService {

    /**
	 * Default method of OrganisationService class
     */
    constructor() { }

    /**
     * Get chart data
     * 
     * @param {any} data data
     * 
     * @return {object} line chart data
     */
    parseLineChart(data: any) {
        var chartList = []
        var groupList = {}
        var i = 0
        _.forEach(data.bucketData, (bucketData, key) => {
            let groupData: object = {}
            let yAxesLabel: string = data.name
            let legendLabel: string = ''

            if (data.series === '') {
                legendLabel = bucketData.name
                groupData['legend'] = [bucketData.name]

                if (bucketData.time_unit !== undefined) {
                    yAxesLabel = bucketData.name + ' (' + bucketData.time_unit + ')'
                } else {
                    yAxesLabel = bucketData.name
                }
            } else {
                groupData['legend'] = data.series
                legendLabel = data.series[i]
            }
            var chartData = this.getLineData(bucketData)

            // Options
            groupData['options'] = this.getChartOption(yAxesLabel)
            groupData['yAxes'] = [{ data: chartData.values, label: legendLabel }]
            groupData['xAxes'] = chartData.labels

            if (groupList[bucketData.group_id]) {
                Array.prototype.push.apply(groupList[bucketData.group_id].yAxes, groupData['yAxes'])
            } else {
                groupList[bucketData.group_id] = groupData
            }

            // Colors
            groupData['colors'] = this.getChartColors(groupList[bucketData.group_id].legend.length)
            i++
        });

        _.forOwn(groupList, function (group, groupId) {
            chartList.push({ yaxesData: group.yAxes, xaxesData: group.xAxes, chartOptions: group.options, chartColors: group.colors })
        })

        return chartList
    }

    /**
     * Get line chart value and lable
     * 
     * @param {any} bucketData line chart value and lable
     */
    getLineData(bucketData: any) {
        let values: Array<any> = []
        let labels: Array<any> = []
        _.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
            values.push(bucketValue.value)
            labels.push(bucketValue.key_name)
        })
        return { labels: labels, values: values }
    }

    /**
     * Get chart options
     * 
     * @param {string} labelString get chart option
     */
    getChartOption(labelString: string) {
        return {
            legend: { display: true },
            scales: {
                xAxes: [{
                    gridLines: { display: false }
                }],
                yAxes: [{
                    scaleLabel: { display: true, labelString: labelString },
                    ticks: { beginAtZero: true }
                }]
            }
        }
    }

    /**
     * Generate random color
     */
    getRandomColor() {
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    /**
     * Get line chart color
     * 
     * @param {number} legendCount legendCount
     */
    getChartColors(legendCount: number) {
        var colorArray = []
        for (var i = 0; i < legendCount; i++) {
            var randColor = this.getRandomColor()
            colorArray.push({
                backgroundColor: randColor,
                borderColor: randColor,
                fill: false
            })
        }
        return colorArray
    }
}
