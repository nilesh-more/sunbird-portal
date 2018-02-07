import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class LineChartService {
    constructor() {}

    /**
	 * @function parseLineChart
	 * @desc parsing data according to line chart
	 * @param {object} res
	 * @return object
	 */
    parseLineChart(res) {
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

    getLineData(bucketData){
        let values: Array<any> = []
        let labels: Array<any> = []
        _.forEach(bucketData.buckets, function (bucketValue, bucketKey) {
        values.push(bucketValue.value)
        labels.push(bucketValue.key_name)
        })
        return { labels: labels, values: values }
    }  

    getChartOption(labelString){
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

    getChartColors(legendCount){
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

    getRandomColor(){
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }
}
