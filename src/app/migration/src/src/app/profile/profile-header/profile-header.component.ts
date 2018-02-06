import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { PermissionService } from './../../services/permission/permission.service';
import { ResourceService } from '../../services/resource/resource.service';
 import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {
  @Output() profileEvents = new EventEmitter();
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) { }

  ngOnInit() {
  }
  logEvent () {
    this.profileEvents.emit('error');
  }
  getProfile () {
    this.userService.userAvailable$.subscribe(
      profileAvailable => {
        if (profileAvailable) {
          // this.processProfileData (this.profileService.profileData);
        } else {
        }
      }
    );
  }
// for deep copy user = { ...currentObject }
  // processProfileData (userProfile) {
  //   profile.loader.showLoader = false
  //   if (userProfile && userProfile.responseCode === 'OK') {
  //     var profileData = angular.copy(userProfile.result.response)

  //     profile.user = profileData
  //     // temp mock data
  //     profile.user.profileVisibility = profileData.profileVisibility
  //     profile.fullName = profileData.firstName + ' ' + profileData.lastName
  //     profile.email = profileData.email
  //     profileData.dob = profileData.dob ? new Date(profileData.dob) : profileData.dob
  //     profile.formateDate(profileData.jobProfile)
  //     profile.formateDate(profileData.address)
  //     profile.formateDate(profileData.education)
  //     // if (profileData.education.length) {
  //     //   profileData.education.forEach(function (education) {
  //     //     education.yearOfPassing = education.yearOfPassing === 0 ? '' : education.yearOfPassing
  //     //     education.percentage = education.percentage === 0 ? '' : education.percentage
  //     //   })
  //     // }
  //     if (profile.isAvatarUpdate) {
  //       $rootScope.avatar = profileData.avatar
  //     }
  //     profile.address = angular.copy(profileData.address)

  //     profile.education = angular.copy(profileData.education)
  //     profile.experience = angular.copy(profileData.jobProfile)
  //     if (profile.user.lastLoginTime > 0) {
  //       profile.lastLoginTime = angular.copy(profile.user.lastLoginTime)
  //     }
  //     if (profile.user.badges) {
  //       profile.getUserBadges()
  //     }
  //     if (profileData.completeness) {
  //       $rootScope.profileCompleteness = profileData.completeness
  //       $('.profile-progress').progress({
  //         percent: $rootScope.profileCompleteness
  //       })
  //     }
  //     if (profileData.missingFields) {
  //       $rootScope.profileMissingFields = profileData.missingFields
  //     }
  //     if (profile.user.profileVisibility) {
  //       $rootScope.privateProfileFields = Object.keys(profile.user.profileVisibility)
  //     } else {
  //       $rootScope.privateProfileFields = []
  //     }

  //     if (profile.user.webPages) {
  //       var socialMedia = {}

  //       socialMedia.fb = profile.user.webPages.find(function (webLink) {
  //         return webLink.type === 'fb'
  //       }) || { type: 'fb', url: '' }

  //       socialMedia.twitter = profile.user.webPages.find(function (webLink) {
  //         return webLink.type === 'twitter'
  //       }) || { type: 'twitter', url: '' }
  //       socialMedia.in = profile.user.webPages.find(function (webLink) {
  //         return webLink.type === 'in'
  //       }) || { type: 'in', url: '' }
  //       socialMedia.blog = profile.user.webPages.find(function (webLink) {
  //         return webLink.type === 'blog'
  //       }) || { type: 'blog', url: '' }

  //       profile.user.socialMedia = socialMedia
  //     }
  //     profile.userSkills = profile.user.skills !== undefined ? profile.user.skills : []
  //     profile.basicProfile = angular.copy(profile.user)
  //   } else {
  //     profile.loader.showLoader = false
  //     profile.isError = true
  //     toasterService.error($rootScope.messages.fmsg.m0005)
  //   }
  // };

}
