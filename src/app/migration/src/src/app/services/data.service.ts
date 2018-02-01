import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
  constructor(public http: HttpClient) { }

  private getHeaders(headers: HttpHeaders | null): object {
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
    let headers = header || this.getHeaders(null); 
    return this.http.get(url, headers);
  }

  post(url, resource) {
    return this.http.post(url, resource);
  }

  update(url, resource) {
    return this.http.patch(url + '/' + resource.id, JSON.stringify({ isRead: true }));
  }

  delete(url, id) {
    return this.http.delete(url + '/' + id);
  }
}
