import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataService {
  constructor(public http: HttpClient) { }

  get(url) {
    return this.http.get(url);
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
