import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PermissionService extends DataService {
  userid: string;
  readPermissionsUrl = '/private/service/v1/learner/data/v1/role/read';
  rolesAndPermissions: any[] = [];
  mainRoles: any[] = [];
  permissionAvailable = false;
  permissionAvailable$ = new BehaviorSubject<boolean>(this.permissionAvailable);
  constructor(public http: HttpClient) {
    super(http);
    this.userid =  (<HTMLInputElement>document.getElementById('userId')).value;
    console.log(this.userid);
    this.getPermissionsData().subscribe(
      data => {
        this.setRolesAndPermissions(data);
      },
      err => {
        console.log('error in getting permission', err);
      }
    );
  }
  public getPermissionsData() {
    const header = this.prepareHeader(null);
    return this.http.get(this.readPermissionsUrl, header);
  }

  private prepareHeader(headers: HttpHeaders | null): object {
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
  public setRolesAndPermissions(data) {
    const rolePermissions = _.cloneDeep(data.result.roles);
    _.forEach(rolePermissions, (r, p) => {
      const mainRole = { role: r.id, actions: [], roleName: r.name };
      this.mainRoles.push(mainRole);
      _.forEach(r.actionGroups, (ag) => {
        const subRole = { role: ag.id, actions: ag.actions, roleName: ag.name };
        mainRole.actions = _.concat(mainRole.actions, ag.actions);
        this.rolesAndPermissions.push(subRole);
      });
      this.rolesAndPermissions.push(mainRole);
    });
    this.rolesAndPermissions = _.uniqBy(this.rolesAndPermissions, 'role');
    this.permissionAvailable$.next(true);
    console.log('Permission available');
  }
}
