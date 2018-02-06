import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

interface RequestParam {
  url: string;
  param?: object;
  header?: object;
  data?: object;
}

@Injectable()
export class DataService {
  headers: object;
  rootOrgId = '';
  constructor(public http: HttpClient) {
  }

  get(requestParam: RequestParam) {
    const httpOptions = {
      headers: this.getHeader(),
      params: (<any>requestParam.param)
    };
    return this.http.get(requestParam.url, httpOptions);
  }

  post(requestParam: RequestParam) {
    const httpOptions = {
      headers: this.getHeader(),
      params: (<any>requestParam.param)
    };
    return this.http.post(requestParam.url, requestParam.data , httpOptions);
  }

  update(requestParam: RequestParam) {
    return this.http.patch(requestParam.url, requestParam.data);
  }

  delete(requestParam: RequestParam) {
    return this.http.delete(requestParam.url);
  }
  private addParam() {
  }
  private getHeader() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': this.rootOrgId,
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
  }
}
