import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
  constructor(public http: HttpClient) { }

  private prepareDefaultHeader(headers?: HttpHeaders): object {
    headers = headers || new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('X-Consumer-ID', 'X-Consumer-ID');
    headers = headers.set('X-Device-ID', 'X-Device-ID');
    headers = headers.set('X-Org-code', 'AP');
    headers = headers.set('X-Source', 'web');
    headers = headers.set('ts', moment().format());
    headers = headers.set('X-msgid', UUID.UUID());

    return {
        headers: headers
    };
  }

  get(url, header) {
    const headerReq = header || this.prepareDefaultHeader(); 
    return this.http.get(url, headerReq)
      .map((res: any) => { 
          if(res && res.responseCode === 'OK'){
            return res
          } else {
            return Observable.throw(res)
          }
        })
      .catch((err) => {
        return Observable.throw(err)
      })

  }

  post(url, data, header) {
    // const headerReq = header || this.prepareDefaultHeader();
    return this.http.post(url, {request: data})
      .map((data: any) => { 
          if(data && data.responseCode === 'OK'){
            return data
          } else {
            return Observable.throw(data)
          }
        })
      .catch((err) => {
        return Observable.throw(err)
      })
  }

  update(url, resource) {
    return this.http.patch(url + '/' + resource.id, JSON.stringify({ isRead: true }));
  }

  delete(url, id) {
    return this.http.delete(url + '/' + id);
  }
}
