import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.css']
})
export class UserSkillsComponent implements OnInit {
  isViewMore = true;
  defaultLimit = 4;
  limit = this.defaultLimit;
  resetLimit = 0;
  user: any;
  roleconFig = (<any>roleConfig);
  constructor(public resourceService: ResourceService,
    public permissionService: PermissionService,
    public userService: UserService) { }

  ngOnInit() {
    this.userService.userData$.subscribe( user => {
      if (user) {
        if (!user.err) {
          this.user = user.userProfile;
        } else if (user.err) {
        }
      }
    });
  }
  setLimit(lim) {
    this.limit = (lim <= 0) ? this.user.skills.length : lim;
  }
  openAddSkillModal() {

  }
}
