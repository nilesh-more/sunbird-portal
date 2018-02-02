import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService extends DataService {

  serchUrl = ''
  constructor(public http: HttpClient) {
    super(http)
    this.serchUrl = ''
  }

  private getDefaultHeader(headers: HttpHeaders | null): object {
      headers = headers || new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('cid', 'sunbird')
      headers = headers.set('headers.Accept', 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8')

      return {
          headers: headers
      };
  }

  getMyContent(status, contentType, params){
    let headers: object = this.getDefaultHeader(null)
    let apiRequest: object = {
        filters:{
          status: status,
          createdBy: 'b14e7747-e66d-49f3-8152-7a6706f0b530',
          contentType: contentType
        },
        sort_by: {
          lastUpdatedOn: params.lastUpdatedOn || 'desc' 
        }
    }

    return this.post('private/service/v1/content/composite/v1/search', apiRequest, headers)
  }

}
