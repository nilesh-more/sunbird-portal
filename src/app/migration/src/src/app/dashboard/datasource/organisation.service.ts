import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.service'
import { HttpClient } from '@angular/common/http';
import { DashboardUtilsService } from '../../dashboard/datasource/dashboard-utils.service'
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class OrganisationService extends DataService  {
    constructor(
        public http: HttpClient,
        public DashboardUtils: DashboardUtilsService
        ) {
        super(http)
    }

    /**
     * @function getData
     */
    getData (apiReq: object, datasetType: string){
        let URL: string = this.DashboardUtils.constructApiUrl(apiReq, datasetType)
        let headers: object = this.DashboardUtils.getDefaultHeaders()
        return this.get(URL, headers)
            .map((data: any) => {
                console.log('Dashboard data received: in datasource', data)
                if (data && data.responseCode === 'OK') {
                    return this.parseApiResponse(data.result, datasetType)
                } else {
                    return Observable.throw(data)
                }
                
            })
            .catch((err) => {
                let apiRes: any
                if (datasetType === 'ORG_CREATION') {
                    apiRes =  {"id":"api.sunbird.dashboard.org.creation","ver":"v1","ts":"2018-02-03 08:01:55:977+0000","params":{"resmsgid":null,"msgid":"da387a34-958f-4bf4-90b6-cffbd6a81cb2","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"Sunbird","orgId":"ORG_001"},"snapshot":{"org.creation.content.count":{"name":"Number of contents created","value":152.0},"org.creation.authors.count":{"name":"Number of authors","value":15},"org.creation.reviewers.count":{"name":"Number of reviewers","value":2},"org.creation.content[@status=draft].count":{"name":"Number of content items created","value":152},"org.creation.content[@status=review].count":{"name":"Number of content items reviewed","value":5},"org.creation.content[@status=published].count":{"name":"Number of content items published","value":3}},"series":{"org.creation.content[@status=draft].count":{"name":"Draft","split":"content.created_on","group_id":"org.content.count","buckets":[{"key":1516991400000,"key_name":"2018-01-27","value":3},{"key":1517077800000,"key_name":"2018-01-28","value":0},{"key":1517164200000,"key_name":"2018-01-29","value":24},{"key":1517250600000,"key_name":"2018-01-30","value":28},{"key":1517337000000,"key_name":"2018-01-31","value":25},{"key":1517423400000,"key_name":"2018-02-01","value":1},{"key":1517509800000,"key_name":"2018-02-02","value":71}]},"org.creation.content[@status=review].count":{"name":"Review","split":"content.reviewed_on","group_id":"org.content.count","buckets":[{"key":1516991400000,"key_name":"2018-01-27","value":0},{"key":1517077800000,"key_name":"2018-01-28","value":0},{"key":1517164200000,"key_name":"2018-01-29","value":0},{"key":1517250600000,"key_name":"2018-01-30","value":3},{"key":1517337000000,"key_name":"2018-01-31","value":0},{"key":1517423400000,"key_name":"2018-02-01","value":1},{"key":1517509800000,"key_name":"2018-02-02","value":1}]},"org.creation.content[@status=published].count":{"name":"Live","split":"content.published_on","group_id":"org.content.count","buckets":[{"key":1516991400000,"key_name":"2018-01-27","value":0},{"key":1517077800000,"key_name":"2018-01-28","value":0},{"key":1517164200000,"key_name":"2018-01-29","value":0},{"key":1517250600000,"key_name":"2018-01-30","value":0},{"key":1517337000000,"key_name":"2018-01-31","value":0},{"key":1517423400000,"key_name":"2018-02-01","value":2},{"key":1517509800000,"key_name":"2018-02-02","value":1}]}}}}
                } else {
                    apiRes = {"id":"api.sunbird.dashboard.org.consumption","ver":"v1","ts":"2018-02-04 13:18:28:382+0000","params":{"resmsgid":null,"msgid":"5eb23f03-0772-4b57-952f-55389d7ba4e5","err":null,"status":"success","errmsg":null},"responseCode":"OK","result":{"period":"7d","org":{"orgName":"Sunbird","orgId":"ORG_001"},"snapshot":{"org.consumption.content.session.count":{"name":"Number of visits by users","value":0},"org.consumption.content.time_spent.sum":{"name":"Content consumption time","value":0.0,"time_unit":"seconds"},"org.consumption.content.time_spent.average":{"name":"Average time spent by user per visit","value":0.0,"time_unit":"seconds"}},"series":{"org.consumption.content.users.count":{"name":"Number of users per day","split":"content.users.count","group_id":"org.users.count","buckets":[{"key":1517145508381,"key_name":"2018-01-28","value":0},{"key":1517231908381,"key_name":"2018-01-29","value":0},{"key":1517318308381,"key_name":"2018-01-30","value":0},{"key":1517404708381,"key_name":"2018-01-31","value":0},{"key":1517491108381,"key_name":"2018-02-01","value":0},{"key":1517577508381,"key_name":"2018-02-02","value":0},{"key":1517663908381,"key_name":"2018-02-03","value":0}]},"org.consumption.content.time_spent.sum":{"name":"Time spent by day","split":"content.time_spent.user.count","time_unit":"seconds","group_id":"org.timespent.sum","buckets":[{"key":1517145508381,"key_name":"2018-01-28","value":0.0},{"key":1517231908381,"key_name":"2018-01-29","value":0.0},{"key":1517318308381,"key_name":"2018-01-30","value":0.0},{"key":1517404708381,"key_name":"2018-01-31","value":0.0},{"key":1517491108381,"key_name":"2018-02-01","value":0.0},{"key":1517577508381,"key_name":"2018-02-02","value":0.0},{"key":1517663908381,"key_name":"2018-02-03","value":0.0}]}}}}
                }
                let res = this.parseApiResponse(apiRes.result, datasetType)
                return Observable.throw(res)
            })
    }

    parseApiResponse(data, datasetType){
            switch (datasetType) {
            case 'ORG_CREATIOIN':
            return this.parseCreationData(data)
            case 'ORG_CONSUMPTION':
            return this.parseConsumptionData(data)
            default:
            return this.parseCreationData(data)
            }
    }

    parseCreationData(data){
        var contentStatus = {
            'org.creation.content[@status=published].count': ' LIVE',
            'org.creation.content[@status=draft].count': ' Created',
            'org.creation.content[@status=review].count': ' IN REVIEW'
        }

        var graphSeries = []
        var blockData = []
        _.forEach(data.snapshot, function (numericData, key) {
            switch (key) {
            case 'org.creation.authors.count':
            case 'org.creation.reviewers.count':
            case 'org.creation.content.count':
            blockData.push(numericData)
            break
            default:
            graphSeries.push(numericData.value + contentStatus[key])
            }
        })

        return {
            bucketData: data.series,
            name: data.period === '5w' ? 'Content created per week' : 'Content created per day',
            numericData: blockData,
            series: graphSeries
        }
    }

    parseConsumptionData(data){
        var blockData = []
        _.forEach(data.snapshot, function (numericData, key) {
          switch (key) {
          case 'org.consumption.content.time_spent.sum':
          case 'org.consumption.content.time_spent.average':
            //blockData.push(this.DashboardUtils.secondToMinConversion(numericData))
            blockData.push(numericData)
            break
          default:
            blockData.push(numericData)
          }
        })

        return {
            bucketData: data.series,
            numericData: blockData,
            series: ''
        }
    }
}
