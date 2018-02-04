import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DashboardUtilsService  {
    datasetType: {}
    constructor() {
        this.datasetType = {
            'BASE_PREFIX':'private/service/',
            'LEARNER_PREFIX':'v1/learner/',
            'ORG_CREATION': 'dashboard/v1/creation/org',
            'ORG_CONSUMPTION': 'dashboard/v1/consumption/org',
            'COURSE_PROGRESS': 'dashboard/v1/progress/course',
            'COURSE_CONSUMPTION': 'dashboard/v1/consumption/course'
        }
    }

    /**
     * @function getData
     */
    constructApiUrl (req, dataset: string){
        let url = this.datasetType['BASE_PREFIX'] + this.datasetType['LEARNER_PREFIX'] +
         this.datasetType[dataset] + '/' + req.identifier + '?period=' + req.timePeriod
        return url
    }

    getDefaultHeaders(){
        let headers = {
            'Content-Type': 'application/json',
            cid: 'sunbird'
        }
        return headers
    }

    secondToMinConversion(numericData){
        console.log('numericData', numericData)
      let num
      if (numericData.value < 60) {
        numericData.value += ' second(s)'
      } else if (numericData.value >= 60 && numericData.value <= 3600) {
        num = numericData.value / 60
        numericData.value = num.toFixed(2) + ' min(s)'
      } else if (numericData.value >= 3600) {
        num = numericData.value / 3600
        numericData.value = num.toFixed(2) + ' hour(s)'
      } else {
        return numericData
      }

      return numericData
    }

    // ===================== Move into renderer =======================
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
