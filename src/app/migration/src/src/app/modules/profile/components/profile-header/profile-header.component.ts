import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit, EventEmitter , Output } from '@angular/core';
import { ProfileEditService } from '../../services/profile-edit/profile-edit.service';

@Component({
  selector: 'profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent implements OnInit {

  @Output() profileEvents = new EventEmitter();
  user: any;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService,
    public profileEditService: ProfileEditService) { }

  ngOnInit() {
    this.getProfile();
  }
  logEvent() {
    this.profileEvents.emit('error');
  }
  getProfile() {
    this.userService.userData$.subscribe(
      userData => {
        if (userData) {
          this.user = userData.userProfile;
        } else {
        }
      }
    );
  }
  updateAvatar(image) {
    if (image[0] && image[0].size < 4000000) {
      const formData = new FormData();
      formData.append('file', image[0]);
      formData.append('container', 'user/' + this.userService.userid);
      this.profileEditService.updateAvatar(formData)
      .subscribe(
        results => {
          console.log(results);
          this.userService.getUserProfile();
        },
        err => {
          console.log(err);
        }
      );
    } else {
      console.log(image);
    }
  }

}
