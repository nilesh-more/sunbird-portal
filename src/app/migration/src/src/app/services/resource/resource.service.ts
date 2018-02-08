import * as  urlConfig from './../../config/url.config.json';
import { DataService } from '../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const urlConFig = (<any>urlConfig);
@Injectable()
export class ResourceService extends DataService {
  messages: any = {};
  frmelmnts: any = {};
  constructor(public http: HttpClient) {
    super(http , urlConFig.URLS.RESOURCEBUNDLES_PREFIX);
    this.getResource().subscribe(
      (data: any) => {
        console.log(data);
          this.messages = data.result.messages;
          this.frmelmnts = data.result.frmelmnts;
      },
      err => {
        console.log('error in getting resource', err);
      }
    );
   }
   public getResource() {
    const option = {
      url: urlConFig.URLS.RESOURCEBUNDLES.ENG
    };
      return this.get(option);
   }

}
