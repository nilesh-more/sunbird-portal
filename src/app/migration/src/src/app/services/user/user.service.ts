import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as  urlConfig from './../../config/url.config.json';
const urlConFig = (<any>urlConfig);
@Injectable()
export class UserService {
  public userid: string;
  private userProfile: any = {};
  private _userData$ = new BehaviorSubject<any>(undefined);
  public readonly userData$: Observable<any> = this._userData$.asObservable();
  constructor(public learner: LearnerService) {

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
       const orgRoleMap = {};
       let organisationIds = [];
       // const organisationNames = [];
      let userRoles = profileData.roles;
      if (profileData.organisations) {
        _.forEach(profileData.organisations, (org) => {
          if (org.roles && _.isArray(org.roles)) {
            userRoles = _.union(userRoles, org.roles);
            if (org.organisationId === profileData.rootOrgId &&
             (_.indexOf(org.roles, 'ORG_ADMIN') > -1 ||
              _.indexOf(org.roles, 'SYSTEM_ADMINISTRATION') > -1)) {
              profileData.rootOrgAdmin = true;
            }
            orgRoleMap[org.organisationId] = org.roles;
          }
          if (org.organisationId) {
            organisationIds.push(org.organisationId);
          }
          // if (org.orgName) {
          //   organisationNames.push(org.orgName);
          // }
        });
      }
      organisationIds = _.uniq(organisationIds);
      this.userProfile = profileData;
      this.userProfile.userRoles = userRoles;
      this.userProfile.orgRoleMap = orgRoleMap;
      this.userProfile.organisationIds = organisationIds;
      // this.userProfile.organisationNames = organisationNames;
      this.processProfileData();
      this._userData$.next({err: null, userProfile: { ...this.userProfile } });
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
  formateDate(userDetails) {
    if (userDetails.length) {
      userDetails.forEach(function (element) {
        if (element.updatedDate) {
          element.updatedDate = new Date(element.updatedDate)
        }
      }, this);
    }
  }
   processProfileData () {
    const profileData: any  = this.userProfile;
    this.userProfile.fullName = profileData.firstName + ' ' + profileData.lastName;
    this.userProfile.dob = profileData.dob ? new Date(profileData.dob) : profileData.dob;
      this.formateDate(this.userProfile.jobProfile);
      this.formateDate(this.userProfile.address);
      this.formateDate(this.userProfile.education);
      // if (profileData.education.length) {
      //   profileData.education.forEach(function (education) {
      //     education.yearOfPassing = education.yearOfPassing === 0 ? '' : education.yearOfPassing
      //     education.percentage = education.percentage === 0 ? '' : education.percentage
      //   })
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
