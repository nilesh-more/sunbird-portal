import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PermissionService } from '../permission/permission.service';
import * as  config from './../../config/config.json';

@Injectable()
export class UserService extends DataService {
  userid: string;
  conFig = (<any>config);
  readUserProfileUrl = this.conFig.readUserProfileUrl;
  rolesAndPermissions: any[] = [];
  userProfile: object = {};
  userRoles: any[] = [];
  roleActions: any[] = [];
  profileData: any;
  userAvailable = false;
  userAvailable$ = new BehaviorSubject<boolean>(this.userAvailable);
  constructor(public http: HttpClient) {
    super(http);
    this.userid =  (<HTMLInputElement>document.getElementById('userId')).value;
    if (this.userid === '<%=userId%>') {
      this.userid = '159e93d1-da0c-4231-be94-e75b0c226d7c';
    }
    this.getUserProfile().subscribe(
      data => {
        this.setCurrentUserProfile(data);
      },
      err => {
        console.log('error in getting profile', err);
      }
    );
  }
  public getUserProfile() {
    const option = {
      url: this.readUserProfileUrl + this.userid,
      param: this.conFig.userReadParam
    };
    return  this.get(option);
  }
  public setCurrentUserProfile(res) {
    if (res && res.responseCode === 'OK') {
       this.profileData = res.result.response;
      let userRoles = this.profileData.roles;
      _.forEach(this.profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles);
        }
      });
      this.userProfile = this.profileData;
      this.userRoles = userRoles;
      this.userAvailable = true;
      this.userAvailable$.next(true);
      console.log('Profile available');
    } else {
      // TODO: allow only public permissions
    }
  }
}
