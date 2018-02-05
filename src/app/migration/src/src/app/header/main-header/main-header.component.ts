import * as config from './../../config/config.json';
import { PermissionService } from './../../services/permission/permission.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ResourceService } from '../../services/resource/resource.service';
// import * as config from './config/config.json';

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
  conFig = (<any>config);
  workSpaceRole = this.conFig.mainHeaderRoles.workSpaceRole;
  adminDashBoard = this.conFig.mainHeaderRoles.adminDashBoard;
  announcementRole = this.conFig.mainHeaderRoles.announcementRole;
  myActivityRole = this.conFig.mainHeaderRoles.myActivityRole;
  orgSetupRole = this.conFig.mainHeaderRoles.orgSetupRole;
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) {
  }

  ngOnInit() {
  }
  logout () {
    window.document.location.replace('/logout');
  }
}
