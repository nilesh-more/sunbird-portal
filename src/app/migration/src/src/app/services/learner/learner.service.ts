import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as  urlConfig from './../../config/url.config.json';
const urlConFig = (<any>urlConfig);
@Injectable()
export class LearnerService extends DataService {
  constructor(public http: HttpClient) {
    super(http, urlConFig.URLS.LEARNER_PREFIX);
  }

}
