import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService extends DataService {

  serchUrl = ''
  
  /**
   * @function constructor
   * @param  {HttpClient} publichttp
   */
  constructor(public http: HttpClient) {
    super(http)
    this.serchUrl = ''
  }

  /**
   * @function getHeaders
   * @param headers
   * @return {object} headers
   */
  private getHeaders(headers?: HttpHeaders): object {
      headers = headers || new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('cid', 'sunbird')
      headers = headers.set('headers.Accept', 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,image/webp,*/*;q=0.8')

      return {
          headers: headers
      };
  }

  /**
   * @function getMyContent
   * @desc get content by user id
   * @param {} status getMyContent
   * @param {} contentType
   * @param {} params
   * @return object
   */
  getMyContent(status, contentType, params){
    let userId = (<HTMLInputElement>document.getElementById('userId')).value
    let headers: object = this.getHeaders()
    let apiRequest: object = {
        filters:{
          status: status,
          createdBy: userId,
          contentType: contentType
        },
        sort_by: {
          lastUpdatedOn: params.lastUpdatedOn || 'desc' 
        }
    }

    return this.post('private/service/v1/content/composite/v1/search', apiRequest, headers)
  }

}
