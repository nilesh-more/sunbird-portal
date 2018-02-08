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
  public userid: string;
  private userProfile: object = {};
  public _userData$ = new BehaviorSubject<any>(undefined);
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
      // this.processProfileData (this.profileData);
      // this.updateProfileImage();
    } else {
      // toasterService.error($rootScope.messages.fmsg.m0005)
      this._userData$.next({err: res.responseCode, userProfile: { ...this.userProfile } });
    }
  }
  // updateProfileImage() {
  //   const imgUrl = 'https://sunbirddev.blob.core.windows.net/user/159e93d1-da0c-4231-be94-e75b0c226d7c/File-01237520614196019216';
  //   setTimeout(() => {
  //     this.userProfile['avatar'] = imgUrl;
  //     console.log('timeout');
  //     this._userData$.next({err: null, userProfile: { ...this.userProfile }});
  //   }, 6000);
  // }
   processProfileData () {
      // const profileData = this.userProfile;

      // profile.user = profileData
      // // temp mock data
      // profile.user.profileVisibility = profileData.profileVisibility
      // profile.fullName = profileData.firstName + ' ' + profileData.lastName
      // profile.email = profileData.email
      // profileData.dob = profileData.dob ? new Date(profileData.dob) : profileData.dob
      // profile.formateDate(profileData.jobProfile)
      // profile.formateDate(profileData.address)
      // profile.formateDate(profileData.education)
      // // if (profileData.education.length) {
      // //   profileData.education.forEach(function (education) {
      // //     education.yearOfPassing = education.yearOfPassing === 0 ? '' : education.yearOfPassing
      // //     education.percentage = education.percentage === 0 ? '' : education.percentage
      // //   })
      // // }
      // if (profile.isAvatarUpdate) {
      //   $rootScope.avatar = profileData.avatar
      // }
      // profile.address = angular.copy(profileData.address)

      // profile.education = angular.copy(profileData.education)
      // profile.experience = angular.copy(profileData.jobProfile)
      // if (profile.user.lastLoginTime > 0) {
      //   profile.lastLoginTime = angular.copy(profile.user.lastLoginTime)
      // }
      // if (profile.user.badges) {
      //   profile.getUserBadges()
      // }
      // if (profileData.completeness) {
      //   $rootScope.profileCompleteness = profileData.completeness
      //   $('.profile-progress').progress({
      //     percent: $rootScope.profileCompleteness
      //   })
      // }
      // if (profileData.missingFields) {
      //   $rootScope.profileMissingFields = profileData.missingFields
      // }
      // if (profile.user.profileVisibility) {
      //   $rootScope.privateProfileFields = Object.keys(profile.user.profileVisibility)
      // } else {
      //   $rootScope.privateProfileFields = []
      // }

      // if (profile.user.webPages) {
      //   var socialMedia = {}

      //   socialMedia.fb = profile.user.webPages.find(function (webLink) {
      //     return webLink.type === 'fb'
      //   }) || { type: 'fb', url: '' }

      //   socialMedia.twitter = profile.user.webPages.find(function (webLink) {
      //     return webLink.type === 'twitter'
      //   }) || { type: 'twitter', url: '' }
      //   socialMedia.in = profile.user.webPages.find(function (webLink) {
      //     return webLink.type === 'in'
      //   }) || { type: 'in', url: '' }
      //   socialMedia.blog = profile.user.webPages.find(function (webLink) {
      //     return webLink.type === 'blog'
      //   }) || { type: 'blog', url: '' }

      //   profile.user.socialMedia = socialMedia
      // }
      // profile.userSkills = profile.user.skills !== undefined ? profile.user.skills : []
      // profile.basicProfile = angular.copy(profile.user)
  }

}
