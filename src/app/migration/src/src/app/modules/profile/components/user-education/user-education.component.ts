import { UserService } from './../../../../services/user/user.service';
import { PermissionService } from './../../../../services/permission/permission.service';
import { ResourceService } from './../../../../services/resource/resource.service';
import { Component, OnInit } from '@angular/core';
import * as roleConfig from './../../../../config/roles.config.json';
@Component({
  selector: 'user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.css']
})
export class UserEducationComponent implements OnInit {

  user: any;
  roleconFig = (<any>roleConfig);
  educationForm = false;
  isNewEducation = false;
  newEducation = {};
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
  cancelEditEducation() {
    this.educationForm = false;
  }
  deleteEducation(deletedExp) {

  }
}
