import { UserService } from './../../../services/user/user.service';
import { PermissionService } from './../../../services/permission/permission.service';
import { ResourceService } from './../../../services/resource/resource.service';
import * as roleConfig from './../../../config/roles.config.json';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})

export class MainHeaderComponent implements OnInit {
  userid: string;
  userProfile: object;
  orgLogo: any;
  isOpen: any;
  userRoles: any;
  roleconFig = (<any>roleConfig);
  workSpaceRole = this.roleconFig.headerDropdownRoles.workSpaceRole;
  adminDashboard = this.roleconFig.headerDropdownRoles.adminDashboard;
  announcementRole = this.roleconFig.headerDropdownRoles.announcementRole;
  myActivityRole = this.roleconFig.headerDropdownRoles.myActivityRole;
  orgSetupRole = this.roleconFig.headerDropdownRoles.orgSetupRole;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.userData$.subscribe(
      user => {
        if (user) {
          if (!user.err) {
            this.userProfile = user.userProfile;
          } else if (user.err) {

          }
        } else {

        }
      }
    );
  }
  logout () {
    window.document.location.replace('/logout');
  }
}
