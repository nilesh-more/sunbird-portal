import { UserService } from './../../../../services/user/user.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { ConfigB } from './../../../../config/config';
import { LearnerService } from './../../../../services/learner/learner.service';
import { Injectable } from '@angular/core';
import * as urlconfig from './../../../../config/url.config.json';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
const urlConfig = (<any>urlconfig);
@Injectable()
export class ProfileEditService {
  rootOrgId = '';
  constructor(private learnerService: LearnerService,
    public resourceService: ResourceService,
    public userService: UserService) { }

  public updateAvatar(file) {
    return this.uploadMedia(file).flatMap( results => {
      const req = {
        avatar: results.result.url,
        userId:  this.userService.userid// 'd5efd1ab-3cad-4034-8143-32c480f5cc9e' // this.userService.userid
      };
      return this.updateProfile(req);
    });
  }
  // public updateUserInfo(option) {
  // return this.updateProfile(option.req).flatMap(
  //     results => {
  //       return Observable.of(results);
  //     }
  //   );
  // }
  public updateProfile(request) {
    const data = {
      id: UUID.UUID(),
      ts: moment().format(),
      params: {},
      request: request
    };
    const options = {
      url: urlConfig.URLS.USER.UPDATE_USER_PROFILE,
      data: data
    };
    return this.learnerService.patch(options);
  }
  public uploadMedia (file) {
    const options = {
      url: urlConfig.URLS.CONTENT.UPLOAD_MEDIA,
      data: file,
      header: this.getHeader()
    };
    return this.learnerService.post(options);
  }
  private getHeader() {
    return {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Consumer-ID': 'X-Consumer-ID',
      'X-Device-ID': 'X-Device-ID',
      'X-Org-code': this.rootOrgId,
      'X-Source': 'web',
      'ts': moment().format(),
      'X-msgid': UUID.UUID()
    };
  }
}
