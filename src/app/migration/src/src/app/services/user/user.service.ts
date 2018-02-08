import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http/src/params';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as  urlConfig from './../../config/url.config.json';
const urlConFig = (<any>urlConfig);
@Injectable()
export class UserService {
  private userid: string;
  private userProfile: object = {};
  private _userData$ = new BehaviorSubject<any>(undefined);
  public readonly userData$: Observable<any> = this._userData$.asObservable();
  constructor(public http: HttpClient, public learner: LearnerService) {

    this.userid =  (<HTMLInputElement>document.getElementById('userId')).value;
    this.userid = this.userid === '<%=userId%>' ? 'userId' : this.userid;
    this.getUserProfile();

  }

  public getProperty(property) {
    if ( this[property] ) {
      return { ...this[property] };
    } else {
      return null;
    }
  }

  public getUserProfile() {
    const option = {
      url: urlConFig.URLS.USER.GET_PROFILE + this.userid,
      param: urlConFig.params.userReadParam
    };
    this.learner.get(option).subscribe(
      data => {
        this.setUserProfile(data);
      },
      err => {
        this._userData$.next({err: err, userProfile: { ...this.userProfile }});
        console.log('error in getting profile', err);
      }
    );
  }

  private setUserProfile(res) {
    if (res && res.responseCode === 'OK') {
       const profileData = res.result.response;
      let userRoles = profileData.roles;
      _.forEach(profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles);
        }
      });
      this.userProfile = profileData;
      this.userProfile['userRoles'] = userRoles;
      this._userData$.next({err: null, userProfile: { ...this.userProfile } });

    } else {

      this._userData$.next({err: res.responseCode, userProfile: { ...this.userProfile } });
    }
  }
}
