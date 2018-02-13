import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.css']
})
export class UserExperienceComponent implements OnInit {
  user: any;
  roleconFig = (<any>roleConfig);
  privateProfileFields = true;
  experienceForm = false;
  isNewExperience = false;
  newExperience = {};
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
  cancelEditExperience() {
    this.experienceForm = false;
  }
  deleteExperience(deletedExp) {

  }
}
