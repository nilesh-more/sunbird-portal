import { UserService } from './../../../services/user/user.service';
import { PermissionService } from './../../../services/permission/permission.service';
import { ResourceService } from './../../../services/resource/resource.service';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';

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
    this.userService.userData$.subscribe(
      profileAvailable => {
        if (profileAvailable) {
          // this.processProfileData (this.profileService.profileData);
        } else {
        }
      }
    );
  }
}
