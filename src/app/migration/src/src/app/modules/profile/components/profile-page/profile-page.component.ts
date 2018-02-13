import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import { BadgesService } from '../../../../services/badges/badges.service';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: any;
  roleconFig = (<any>roleConfig);
  workSpaceRole = this.roleconFig.headerDropdownRoles.workSpaceRole;
  isError = false;
  showLoader = true;
  loaderMessage = {
    headerMessage: '',
    loaderMessage: 'Loading profile ...'
  };
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService,
    public badgesService: BadgesService) { }

  ngOnInit() {
    this.userService.userData$.subscribe( user => {
      if (user) {
        if (!user.err) {
          this.showLoader = false;
          this.user = user.userProfile;
        } else if (user.err) {
          this.isError = true;
        }
      }
    });
  }
  eventHandler (data) {
    this.isError = true;
    console.log('got error', data);
  }
  updateAction(field) {
    console.log(field);
  }
}
