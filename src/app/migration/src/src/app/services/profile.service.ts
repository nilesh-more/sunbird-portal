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
export class ProfileService extends DataService {
  userid: string;
  readUserProfileUrl = '/private/service/v1/learner/user/v1/read/';
  rolesAndPermissions: any[] = [];  // permission sevrvice
  currentUserProfile: object = {};
  currentUserRoles: any[] = [];
  currentRoleActions: any[] = [];
  profileAvailable = false;
  profileAvailable$ = new BehaviorSubject<boolean>(this.profileAvailable);
  constructor(public http: HttpClient) {
    super(http);
    this.userid =  (<HTMLInputElement>document.getElementById('userId')).value;
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
    const header = this.prepareHeader(null);
    return  this.http.get(this.readUserProfileUrl + this.userid, header);
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
  public setCurrentUserProfile(res) {
    if (res && res.responseCode === 'OK') {
      const profileData = res.result.response;
      let userRoles = profileData.roles;
      _.forEach(profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles);
        }
      });
      this.currentUserProfile = profileData;
      this.currentUserRoles = userRoles;
      this.setCurrentRoleActions(userRoles);
    } else {
      // TODO: allow only public permissions
    }
  }

  public setCurrentRoleActions(userRoles) {
    _.forEach(userRoles,  (r) => {
      const roleActions = _.filter(this.rolesAndPermissions, { role: r });
      if (_.isArray(roleActions) && roleActions.length > 0) {
        this.currentRoleActions = _.concat(this.currentRoleActions,
          _.map(roleActions[0].actions, 'id'));
      }
    });
    this.profileAvailable$.next(true);
    console.log('Profile available');
  }
}
