import * as  config from './../../config/config.json';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ResourceService extends DataService {
  messages: any = {};
  frmelmnts: any = {};
  conFig = (<any>config);
  resourceBundlesUrl = this.conFig.resourceBundlesUrl;
  constructor(public http: HttpClient) {
    super(http);
    this.getResource().subscribe(
      (data: any) => {
        console.log(data);
        if (data.responseCode === 'OK') {
          this.messages = data.result.messages;
          this.frmelmnts = data.result.frmelmnts;
        } else {
          console.log('failed in fetching resource');
        }
      },
      err => {
        console.log('error in getting resource', err);
      }
    );
   }
   public getResource() {
    const option = {
      url: this.resourceBundlesUrl
    };
      return this.get(option);
   }

}
